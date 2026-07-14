/**
 * Cloudflare Pages Function — POST /subscribe
 *
 * Bindings required (set in CF Pages → Settings → Functions):
 *   D1 database binding:  DB  → mypromptpro-subscribers
 *   Environment variable: RESEND_API_KEY  (Production + Preview)
 */

const PDF_URL = 'https://mypromptpro.com/free-prompts-sample.pdf';
const FROM_EMAIL = 'onboarding@resend.dev';   // swap to hello@mypromptpro.com once domain is verified in Resend
const SITE_URL = 'https://mypromptpro.com';

// ─── CORS headers (same-origin in production; handy for localhost dev) ──────
function corsHeaders(origin) {
  const allowed = [SITE_URL, 'http://localhost:4321', 'http://localhost:3000'];
  return {
    'Access-Control-Allow-Origin': allowed.includes(origin) ? origin : SITE_URL,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

// ─── Handle OPTIONS preflight ─────────────────────────────────────────────
export async function onRequestOptions({ request }) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request.headers.get('Origin') || ''),
  });
}

// ─── Handle POST /subscribe ───────────────────────────────────────────────
export async function onRequestPost({ request, env }) {
  const origin = request.headers.get('Origin') || '';
  const headers = { 'Content-Type': 'application/json', ...corsHeaders(origin) };

  // 1. Parse body
  let email;
  try {
    const body = await request.json();
    email = (body.email || '').trim().toLowerCase();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body.' }), { status: 400, headers });
  }

  // 2. Validate email
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: 'Please enter a valid email address.' }), { status: 400, headers });
  }

  // 3. Save to D1 (ignore duplicate emails — don't error, just skip INSERT)
  try {
    await env.DB.prepare(
      `INSERT INTO subscribers (email, source) VALUES (?, ?) ON CONFLICT(email) DO NOTHING`
    ).bind(email, 'homepage').run();
  } catch (err) {
    console.error('D1 insert error:', String(err));
    const errMsg = String(err);
    if (errMsg.includes('no such table')) {
      return new Response(JSON.stringify({ error: 'DB not set up yet — run schema.sql in D1 console.' }), { status: 500, headers });
    }
    if (errMsg.includes('DB') || errMsg.includes('binding')) {
      return new Response(JSON.stringify({ error: 'DB binding missing — check Cloudflare Pages > Settings > Bindings.' }), { status: 500, headers });
    }
    return new Response(JSON.stringify({ error: 'Something went wrong. Please try again.' }), { status: 500, headers });
  }

  // 4. Send welcome email via Resend (non-fatal: if Resend fails, subscriber is still saved)
  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: email,
        reply_to: 'hello@mypromptpro.com',
        subject: 'Your 5 free ChatGPT prompts for teachers ✦',
        html: buildEmailHtml(PDF_URL),
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      console.error('Resend error:', resendRes.status, errText);
    }
  } catch (err) {
    console.error('Resend fetch error:', err);
  }

  return new Response(JSON.stringify({ success: true }), { status: 200, headers });
}

// ─── Welcome email HTML ───────────────────────────────────────────────────
function buildEmailHtml(pdfUrl) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Your 5 free prompts</title>
</head>
<body style="margin:0;padding:0;background:#f8f6f1;font-family:Inter,Helvetica,Arial,sans-serif;color:#26303B;">
  <div style="max-width:580px;margin:32px auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #D9E0E8;">

    <!-- Header bar -->
    <div style="background:linear-gradient(135deg,#1B3A6B,#2D6CDF);padding:28px 40px 24px;">
      <div style="font-family:Poppins,Helvetica,Arial,sans-serif;font-weight:700;font-size:18px;color:#ffffff;letter-spacing:.3px;">
        MyPrompt<span style="color:#93beff;">Pro</span>
      </div>
    </div>

    <!-- Body -->
    <div style="padding:36px 40px;">
      <h1 style="font-family:Poppins,Helvetica,Arial,sans-serif;font-weight:700;font-size:26px;color:#1B3A6B;margin:0 0 14px;line-height:1.2;">
        Here are your 5 free prompts ✦
      </h1>
      <p style="font-size:15px;line-height:24px;margin:0 0 22px;color:#3a4654;">
        We picked 5 of the most-used prompts from the full library — a complete lesson plan,
        an irresistible lesson hook, an emergency sub plan, a warm grading comment, and a
        positive note home. Every one includes a real classroom example so you can see the
        output before you run it.
      </p>

      <!-- Download button -->
      <div style="text-align:center;margin:0 0 32px;">
        <a href="${pdfUrl}"
           style="display:inline-block;background:#2D6CDF;color:#ffffff;font-family:Poppins,Helvetica,Arial,sans-serif;
                  font-weight:700;font-size:16px;text-decoration:none;padding:16px 40px;border-radius:10px;letter-spacing:.3px;">
          Download your free PDF &rarr;
        </a>
      </div>

      <hr style="border:0;border-top:1px solid #D9E0E8;margin:0 0 26px;">

      <!-- What's in the full library -->
      <p style="font-size:14px;font-weight:600;color:#1B3A6B;margin:0 0 10px;">What's in the full library?</p>
      <p style="font-size:14px;line-height:22px;color:#5B6875;margin:0 0 14px;">
        75 engineered prompts across 6 sections — Lesson Planning, Grading &amp; Feedback,
        Parent Communication, Differentiated Instruction, Classroom Management, and Admin &amp; Reports
        — plus a <strong style="color:#26303B;">13-prompt Special Education bonus kit</strong> covering
        IEP goals, BIPs, PLAAFPs, progress reports, and more.
      </p>
      <p style="font-size:14px;line-height:22px;color:#5B6875;margin:0;">
        See everything at&nbsp;
        <a href="https://mypromptpro.com/teachers/"
           style="color:#2D6CDF;text-decoration:none;font-weight:600;">mypromptpro.com/teachers</a>
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f8f6f1;padding:18px 40px;border-top:1px solid #D9E0E8;text-align:center;">
      <p style="font-size:12px;color:#8a96a3;margin:0;line-height:18px;">
        MyPromptPro &middot;
        <a href="https://mypromptpro.com" style="color:#8a96a3;text-decoration:none;">mypromptpro.com</a><br>
        You signed up at mypromptpro.com. No spam, ever.
      </p>
    </div>
  </div>
</body>
</html>`;
}
