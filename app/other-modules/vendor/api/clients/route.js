import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { adminClient } from '@/utils/supabase/admin';
import { resolveAuthenticatedUserContext } from '@/utils/auth/context';
import { sendVendorAccountCreatedEmail } from '@/utils/email-outbox';

const VENDOR_PROFILES_TABLE = 'vendor_profiles';
const VENDOR_INVOICES_TABLE = 'vendor_invoices';

async function getInternalAuthContext() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return null;

  const authContext = await resolveAuthenticatedUserContext(supabase, user);
  // Ensure user is an internal team member (not a vendor)
  if (!authContext || authContext.accountType === 'vendor') return null;

  return authContext;
}

export async function GET(request) {
  try {
    const authContext = await getInternalAuthContext();
    if (!authContext) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    let profilesQuery = adminClient
      .from(VENDOR_PROFILES_TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (search) {
      profilesQuery = profilesQuery.or(`vendor_name.ilike.%${search}%,email.ilike.%${search}%,phone_number.ilike.%${search}%`);
    }

    const { data: profiles, error: profilesError } = await profilesQuery;
    if (profilesError) throw profilesError;

    // Fetch all invoices
    const { data: invoices, error: invoicesError } = await adminClient
      .from(VENDOR_INVOICES_TABLE)
      .select(`
        *,
        vendor: ${VENDOR_PROFILES_TABLE} (id, vendor_name, email, phone_number)
      `)
      .order('created_at', { ascending: false });

    if (invoicesError) throw invoicesError;

    return NextResponse.json({
      vendors: profiles || [],
      invoices: invoices || []
    });
  } catch (error) {
    console.error('GET /api/clients error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function formatE164Phone(phone) {
  if (!phone) return null;
  const cleaned = String(phone).trim().replace(/[^\d+]/g, '');
  if (!cleaned) return null;
  if (cleaned.startsWith('+')) return cleaned;
  if (cleaned.length === 10) return `+91${cleaned}`;
  return `+${cleaned}`;
}

export async function POST(request) {
  try {
    const authContext = await getInternalAuthContext();
    if (!authContext) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { vendorName, email, phoneNumber, password } = body;

    if (!vendorName || !email || !password) {
      return NextResponse.json(
        { error: 'Vendor Name, Email, and Password are required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const cleanPhone = phoneNumber ? String(phoneNumber).trim() : null;
    const e164Phone = formatE164Phone(cleanPhone);

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    // 1. Check if auth user already exists in Supabase
    let authUserId = null;
    const { data: existingUserList } = await adminClient.auth.admin.listUsers();
    const existingAuthUser = (existingUserList?.users || []).find(
      (u) => u.email?.toLowerCase() === normalizedEmail
    );

    const userMetadata = {
      role: 'vendor',
      full_name: vendorName,
      phone_number: cleanPhone,
    };

    if (existingAuthUser) {
      authUserId = existingAuthUser.id;
      const updateData = {
        password: password,
        email_confirm: true,
        user_metadata: userMetadata,
      };
      if (e164Phone) {
        updateData.phone = e164Phone;
        updateData.phone_confirm = true;
      }
      try {
        await adminClient.auth.admin.updateUserById(authUserId, updateData);
      } catch (authErr) {
        // Fallback without phone if phone collision occurs
        delete updateData.phone;
        delete updateData.phone_confirm;
        await adminClient.auth.admin.updateUserById(authUserId, updateData);
      }
    } else {
      // Create new Supabase Auth User
      const createData = {
        email: normalizedEmail,
        password: password,
        email_confirm: true,
        user_metadata: userMetadata,
      };
      if (e164Phone) {
        createData.phone = e164Phone;
        createData.phone_confirm = true;
      }

      let newUser = null;
      try {
        const { data, error: createAuthError } = await adminClient.auth.admin.createUser(createData);
        if (createAuthError) throw createAuthError;
        newUser = data;
      } catch (authErr) {
        // Retry without phone property if country code validation fails, keeping phone in user_metadata
        delete createData.phone;
        delete createData.phone_confirm;
        const { data, error: retryError } = await adminClient.auth.admin.createUser(createData);
        if (retryError) {
          throw new Error(`Failed to create auth user: ${retryError.message}`);
        }
        newUser = data;
      }
      authUserId = newUser.user.id;
    }

    // 2. Check if vendor_profile already exists
    const { data: existingProfiles } = await adminClient
      .from(VENDOR_PROFILES_TABLE)
      .select('id')
      .or(`auth_user_id.eq.${authUserId},email.ilike.${normalizedEmail}`)
      .limit(1);

    const existingProfile = existingProfiles?.[0] || null;

    let createdProfile = null;
    if (existingProfile) {
      const { data: updated, error: updateError } = await adminClient
        .from(VENDOR_PROFILES_TABLE)
        .update({
          auth_user_id: authUserId,
          vendor_name: vendorName,
          email: normalizedEmail,
          phone_number: cleanPhone,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingProfile.id)
        .select('*')
        .single();

      if (updateError) throw updateError;
      createdProfile = updated;
    } else {
      const { data: inserted, error: insertError } = await adminClient
        .from(VENDOR_PROFILES_TABLE)
        .insert({
          auth_user_id: authUserId,
          vendor_name: vendorName,
          email: normalizedEmail,
          phone_number: cleanPhone,
          is_profile_completed: false
        })
        .select('*')
        .single();

      if (insertError) throw insertError;
      createdProfile = inserted;
    }

    // 3. Dispatch credentials email
    const configuredAppUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://universeone.bncglobal.in';
    const appUrl = configuredAppUrl.includes('tasks.bncglobal.in') ? 'https://universeone.bncglobal.in' : configuredAppUrl.replace(/\/$/, '');
    const vendorLoginUrl = `${appUrl}/login`;

    await sendVendorAccountCreatedEmail({
      vendorName,
      recipientEmail: normalizedEmail,
      phone: cleanPhone,
      tempPassword: password,
      loginUrl: vendorLoginUrl
    }).catch(err => {
      console.warn('Non-fatal: Email dispatch failed for vendor:', err.message);
    });

    return NextResponse.json({
      success: true,
      vendor: createdProfile,
      credentials: {
        email: normalizedEmail,
        password: password,
        loginUrl: vendorLoginUrl
      }
    });
  } catch (error) {
    console.error('POST /api/clients error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
