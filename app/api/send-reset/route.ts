import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const RESEND_API_KEY = process.env.RESEND_API_KEY!;
// Default to Resend's testing domain if not specified.
// User must verify a domain to use a custom email in production.
const EMAIL_FROM = process.env.EMAIL_FROM || 'onboarding@resend.dev';
const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !RESEND_API_KEY) {
    console.error('Missing required environment variables for password reset (Supabase or Resend).');
}

const resend = new Resend(RESEND_API_KEY);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const email = (body.email || '').trim().toLowerCase();

        if (!email) {
            return NextResponse.json({ error: 'Missing email' }, { status: 400 });
        }

        // 1) Generate recovery link via Supabase Admin endpoint
        const adminResp = await fetch(`${SUPABASE_URL}/auth/v1/admin/generate_link`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                apikey: SUPABASE_SERVICE_ROLE_KEY,
                Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            },
            body: JSON.stringify({
                type: 'recovery',
                email,
                redirectTo: `${SITE_URL}/auth/callback?next=/reset-password`
            }),
        });

        if (!adminResp.ok) {
            const text = await adminResp.text();
            console.error('Supabase admin/generate_link error:', adminResp.status, text);
            return NextResponse.json({ error: 'Failed to generate recovery link' }, { status: 502 });
        }

        const adminData = await adminResp.json();
        const recoveryLink = adminData?.action_link;
        if (!recoveryLink) {
            console.error('No action_link in Supabase response', adminData);
            return NextResponse.json({ error: 'No recovery link returned' }, { status: 502 });
        }

        // 2) Send email via Resend
        const { data, error } = await resend.emails.send({
            from: EMAIL_FROM,
            to: email, // works with 'onboarding@resend.dev' ONLY if 'email' is the account owner's email during testing
            subject: 'Reset your Password - NextGen Chatbot',
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>Hello,</p>
          <p>You requested a password reset for your NextGen Chatbot account. Click the button below to reset your password:</p>
          <p style="text-align:center; margin: 30px 0;">
            <a href="${recoveryLink}" style="display:inline-block;padding:12px 24px;background:#8b5cf6;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;">
              Reset Password
            </a>
          </p>
          <p style="color: #666; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
        });

        if (error) {
            console.error('Resend error:', error);
            return NextResponse.json({ error: 'Failed to send email via Resend' }, { status: 502 });
        }

        return NextResponse.json({ ok: true, data });

    } catch (err: any) {
        console.error('send-reset error', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
