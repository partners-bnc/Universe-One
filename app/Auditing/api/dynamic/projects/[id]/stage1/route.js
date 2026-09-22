import { NextResponse } from 'next/server';
import { adminClient } from '@/utils/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  try {
    const { id: projectId } = await params;
    const supabase = adminClient;

    // Fetch Org Structure
    const { data: orgData } = await supabase
      .from('audit_pre_execution_org')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });

    // Fetch Weekly Calendar
    const { data: calData } = await supabase
      .from('audit_pre_execution_calendar')
      .select('*')
      .eq('project_id', projectId)
      .order('sort_order', { ascending: true });

    // If any records have NULL progress, backfill them directly in the database
    const hasNullProgress = (calData || []).some(item => item.progress === null || item.progress === undefined);
    if (hasNullProgress) {
      Promise.allSettled([
        supabase.from('audit_pre_execution_calendar').update({ progress: 100 }).is('progress', null).eq('status', 'Done'),
        supabase.from('audit_pre_execution_calendar').update({ progress: 50 }).is('progress', null).eq('status', 'In Progress'),
        supabase.from('audit_pre_execution_calendar').update({ progress: 0 }).is('progress', null).neq('status', 'Done').neq('status', 'In Progress')
      ]).catch(() => {});
    }

    const mappedCalData = (calData || []).map(item => ({
      ...item,
      progress: item.progress !== null && item.progress !== undefined
        ? item.progress
        : (item.status === 'Done' ? 100 : (item.status === 'In Progress' ? 50 : 0))
    }));

    return NextResponse.json({
      success: true,
      org_structure: orgData || [],
      calendar: mappedCalData
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const { id: projectId } = await params;
    const body = await req.json();
    const { type, data, bulk, items } = body; // type: 'org' | 'calendar'

    const supabase = adminClient;

    if (type === 'org') {
      if (bulk && Array.isArray(items)) {
        const rows = items.map(item => ({
          project_id: projectId,
          member_name: item.member_name || item.name || 'Unnamed Contact',
          designation: item.designation || '',
          department: item.department || '',
          email: item.email || '',
          phone: item.phone || '',
          reporting_to: item.reporting_to || ''
        }));
        const { data: inserted, error } = await supabase
          .from('audit_pre_execution_org')
          .insert(rows)
          .select();
        if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        return NextResponse.json({ success: true, items: inserted });
      }

      const { member_name, designation, department, email, phone, reporting_to } = data || {};
      const { data: inserted, error } = await supabase
        .from('audit_pre_execution_org')
        .insert([{
          project_id: projectId,
          member_name: member_name || 'Unnamed Contact',
          designation: designation || '',
          department: department || '',
          email: email || '',
          phone: phone || '',
          reporting_to: reporting_to || ''
        }])
        .select()
        .single();

      if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, item: inserted });
    }

    if (type === 'calendar') {
      if (bulk && Array.isArray(items)) {
        const rows = items.map((item, idx) => ({
          project_id: projectId,
          week_name: item.week_name || `Week ${idx + 1}`,
          week_description: item.week_description || '',
          activity: item.activity || '',
          detailed_audit_work: item.detailed_audit_work || '',
          status: item.status || 'Pending',
          progress: item.progress !== undefined && item.progress !== null ? parseInt(item.progress, 10) : (item.status === 'Done' ? 100 : 0),
          remarks: item.remarks || '',
          sort_order: item.sort_order || idx + 1
        }));
        let { data: inserted, error } = await supabase
          .from('audit_pre_execution_calendar')
          .insert(rows)
          .select();

        // If progress column doesn't exist yet, retry without progress
        if (error && (error.code === '42703' || error.message?.includes('progress'))) {
          const fallbackRows = rows.map(r => {
            const copy = { ...r };
            delete copy.progress;
            return copy;
          });
          const retry = await supabase.from('audit_pre_execution_calendar').insert(fallbackRows).select();
          inserted = retry.data;
          error = retry.error;
        }

        if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        return NextResponse.json({ success: true, items: inserted });
      }

      const { week_name, week_description, activity, detailed_audit_work, status, progress, remarks, sort_order } = data || {};
      const insertPayload = {
        project_id: projectId,
        week_name: week_name || 'Week 1',
        week_description: week_description || '',
        activity: activity || '',
        detailed_audit_work: detailed_audit_work || '',
        status: status || 'Pending',
        progress: progress !== undefined && progress !== null ? parseInt(progress, 10) : (status === 'Done' ? 100 : 0),
        remarks: remarks || '',
        sort_order: sort_order || 0
      };

      let { data: inserted, error } = await supabase
        .from('audit_pre_execution_calendar')
        .insert([insertPayload])
        .select()
        .single();

      if (error && (error.code === '42703' || error.message?.includes('progress'))) {
        delete insertPayload.progress;
        const retry = await supabase.from('audit_pre_execution_calendar').insert([insertPayload]).select().single();
        inserted = retry.data;
        error = retry.error;
      }

      if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, item: inserted });
    }

    return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const { id: projectId } = await params;
    const body = await req.json();
    const { type, itemId, data } = body; // type: 'calendar' | 'org'

    if (!itemId) {
      return NextResponse.json({ success: false, error: "itemId is required" }, { status: 400 });
    }

    const supabase = adminClient;
    const table = type === 'org' ? 'audit_pre_execution_org' : 'audit_pre_execution_calendar';
    const rawData = data || {};
    const updatePayload = {};

    if (type === 'calendar') {
      const allowedKeys = ['week_name', 'week_description', 'activity', 'detailed_audit_work', 'status', 'progress', 'remarks', 'sort_order', 'assigned_team_id'];
      allowedKeys.forEach(k => {
        if (rawData[k] !== undefined) updatePayload[k] = rawData[k];
      });
      if (updatePayload.progress !== undefined) {
        updatePayload.progress = parseInt(updatePayload.progress, 10);
      }
    } else if (type === 'org') {
      const allowedKeys = ['member_name', 'designation', 'department', 'email', 'phone', 'reporting_to'];
      allowedKeys.forEach(k => {
        if (rawData[k] !== undefined) updatePayload[k] = rawData[k];
      });
    }

    let { data: updated, error } = await supabase
      .from(table)
      .update(updatePayload)
      .eq('id', itemId)
      .eq('project_id', projectId)
      .select()
      .single();

    if (error && (error.code === '42703' || error.message?.includes('progress'))) {
      delete updatePayload.progress;
      const retry = await supabase.from(table).update(updatePayload).eq('id', itemId).eq('project_id', projectId).select().single();
      updated = retry.data;
      error = retry.error;
    }

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, item: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id: projectId } = await params;
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const itemId = searchParams.get('itemId');

    if (!type || !itemId) {
      return NextResponse.json({ success: false, error: "Missing type or itemId" }, { status: 400 });
    }

    const supabase = adminClient;
    const table = type === 'org' ? 'audit_pre_execution_org' : 'audit_pre_execution_calendar';

    const { error } = await supabase.from(table).delete().eq('id', itemId).eq('project_id', projectId);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
