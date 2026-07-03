// Quantra contact-form delivery — Vercel serverless function (Node, no deps).
// Receives the form POST, emails the lead via Resend, optionally pings Discord.
// Same-origin (the site posts to /api/contact) so no CORS needed.
//
// Env vars (set in Vercel → Project → Settings → Environment Variables):
//   RESEND_API_KEY        (required) — from resend.com
//   LEADS_TO              (optional) — where leads land. default zuaan@quantratech.co.za
//   LEADS_FROM            (optional) — verified sender. default "Quantra Leads <leads@quantratech.co.za>"
//   DISCORD_LEADS_WEBHOOK (optional) — a Discord channel webhook URL for a lead ping
//
// Until RESEND_API_KEY is set this returns 500, and js/main.js falls back to mailto
// (so a lead is never silently lost).

const esc = (s) => String(s == null ? '' : s).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method not allowed' });
  }

  // body: Vercel usually parses JSON into req.body; fall back to raw stream
  let body = req.body;
  if (!body || typeof body !== 'object') {
    try {
      const raw = await new Promise((resolve, reject) => {
        let d = '';
        req.on('data', (c) => { d += c; });
        req.on('end', () => resolve(d));
        req.on('error', reject);
      });
      body = raw ? JSON.parse(raw) : {};
    } catch (e) {
      return res.status(400).json({ ok: false, error: 'bad json' });
    }
  }

  const name = (body.name || '').trim();
  const email = (body.email || '').trim();
  const company = (body.company || '').trim();
  const bottleneck = (body.bottleneck || '').trim();
  const source = (body.source || 'direct').trim();
  const honeypot = (body.company_url || '').trim();

  // honeypot: a bot filled the hidden field — pretend success, send nothing
  if (honeypot !== '') return res.status(200).json({ ok: true });

  if (!name || !email || !company || !bottleneck) {
    return res.status(400).json({ ok: false, error: 'missing fields' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const LEADS_TO = process.env.LEADS_TO || 'zuaan@quantratech.co.za';
  const LEADS_FROM = process.env.LEADS_FROM || 'Quantra Leads <leads@quantratech.co.za>';
  if (!RESEND_API_KEY) return res.status(500).json({ ok: false, error: 'email not configured' });

  const subject = `New website lead: ${name} (${source})`;
  const text =
    `New lead from the Quantra site\n\n` +
    `Name: ${name}\nEmail: ${email}\nCompany: ${company}\nSource (page): ${source}\n\n` +
    `Message:\n${bottleneck}\n`;
  const html =
    `<h2 style="font-family:sans-serif">New website lead</h2>` +
    `<p style="font-family:sans-serif;line-height:1.6">` +
    `<strong>Name:</strong> ${esc(name)}<br>` +
    `<strong>Email:</strong> <a href="mailto:${esc(email)}">${esc(email)}</a><br>` +
    `<strong>Company:</strong> ${esc(company)}<br>` +
    `<strong>Source (page):</strong> ${esc(source)}</p>` +
    `<p style="font-family:sans-serif;line-height:1.6"><strong>Message:</strong><br>${esc(bottleneck).replace(/\n/g, '<br>')}</p>`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: LEADS_FROM, to: [LEADS_TO], reply_to: email, subject, text, html }),
    });
    if (!r.ok) {
      const detail = (await r.text().catch(() => '')).slice(0, 300);
      return res.status(502).json({ ok: false, error: 'send failed', detail });
    }
  } catch (e) {
    return res.status(502).json({ ok: false, error: 'send error' });
  }

  // optional Discord ping (a channel webhook URL — no bot token needed)
  const DISCORD = process.env.DISCORD_LEADS_WEBHOOK;
  if (DISCORD) {
    try {
      await fetch(DISCORD, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `🟢 New lead — **${name}** / ${company} / ${email} · source \`${source}\`\n> ${bottleneck.slice(0, 400)}`,
        }),
      });
    } catch (e) { /* non-fatal */ }
  }

  return res.status(200).json({ ok: true });
};
