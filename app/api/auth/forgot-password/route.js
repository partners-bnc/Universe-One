import { NextResponse } from 'next/server';
import {
  getResetRedirectUrl,
  sendPasswordResetEmailForIdentifier,
} from '@/utils/employee-auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const identifier = String(body?.identifier ?? '').trim();

    if (!identifier) {
      return NextResponse.json({ error: 'Email or username is required' }, { status: 400 });
    }

    await sendPasswordResetEmailForIdentifier(identifier, getResetRedirectUrl());

    return NextResponse.json({
      success: true,
      message: 'If an account exists, we sent a password reset link.',
    });
  } catch (error) {
    console.error('Error sending forgot password email:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
