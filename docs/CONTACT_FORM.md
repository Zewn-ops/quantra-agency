# Contact form — delivery wiring

The contact form (`/contact`) submits **client-side**: `js/main.js` POSTs JSON to
`CONTACT_ENDPOINT`. On error it falls back to a `mailto:` so a lead is never silently lost.

```
payload = { name, email, company, bottleneck, source, company_url }   // company_url = honeypot
```

---

## ✅ CHOSEN (2026-06-30): Vercel serverless function + Resend

`CONTACT_ENDPOINT = '/api/contact'` → **`api/contact.js`** (same-origin, so no CORS). The function
validates + honeypot-drops, emails the lead via **Resend**, and (optionally) pings Discord. It's on
Vercel where the site already lives → **always up, independent of the NUC**, no public exposure of n8n.
No npm/framework added (single CommonJS file, built-in `fetch`). Source/page is in every lead
(`subject: New website lead: {name} ({source})`).

### Zewn's one-time setup (so the email actually sends)
1. **Resend account** → https://resend.com (free, 3k emails/mo, 100/day).
2. **Verify the sender domain** `quantratech.co.za` in Resend → it shows DNS records (SPF `TXT`,
   DKIM, return-path). Add them at the DNS host (`tld-ns.com` panel — no migration needed). Wait for
   green/verified. *(Quick test before verifying: set `LEADS_FROM="onboarding@resend.dev"` +
   `LEADS_TO=<your Resend account email>` — Resend's sandbox only delivers to the account owner.)*
3. **API key** in Resend → copy it.
4. **Vercel → project `quantra-agency` → Settings → Environment Variables** (Production):
   - `RESEND_API_KEY` = the key  *(required)*
   - `LEADS_TO` = `zuaan@quantratech.co.za` *(or a `leads@`/`hello@` alias)*
   - `LEADS_FROM` = `Quantra Leads <leads@quantratech.co.za>` *(must be on the verified domain)*
   - `DISCORD_LEADS_WEBHOOK` = a Discord channel webhook URL *(optional — adds a lead ping)*
5. **Redeploy** (env changes need a new deploy).
6. **Test:** submit the form on the deployed site → email (and Discord) arrive. Or
   `curl -X POST https://quantratech.co.za/api/contact -H 'Content-Type: application/json' -d '{"name":"Test","email":"t@t.co","company":"X","bottleneck":"y","source":"test"}'` → expect `{"ok":true}` + email.

> ⚠️ Until `RESEND_API_KEY` is set, `/api/contact` returns 500 and the form **gracefully falls back to
> mailto** — no lead lost, but no auto-email until step 4 is done.
> ⚠️ The local preview (`http://localhost:8800`, python static server) does **not** run the function —
> form there always hits the mailto fallback. Test the email path with `vercel dev` or a Vercel deploy.

---

## Alternative (NOT used): self-hosted n8n webhook

Kept for reference. Free + gives a Discord ping, but needs n8n exposed publicly (Tailscale Funnel /
Cloudflare Tunnel) and couples lead delivery to the NUC being awake — which is why we chose the Vercel
function instead.

## The one blocker: n8n must be PUBLIC

n8n on the NUC is `192.168.110.69:5678` — **LAN only**. A visitor's browser on
`quantratech.co.za` cannot reach a LAN IP. The webhook needs a public HTTPS URL.

Pick one (recommended first):

1. **Tailscale Funnel** (you already run Tailscale) — exposes one path publicly over
   HTTPS, no extra infra:
   ```
   # on the NUC (one-time browser auth for Funnel may be required)
   tailscale funnel --bg --https=443 http://127.0.0.1:5678
   # public base => https://quantranuc.tail9a886e.ts.net
   # webhook URL  => https://quantranuc.tail9a886e.ts.net/webhook/contact
   ```
   ⚠️ Funnel publishes ALL of n8n at that host. Keep n8n auth on; only the
   `/webhook/*` path matters to us. (A reverse-proxy that exposes only `/webhook/`
   is tidier if you want to lock it down.)

2. **Cloudflare Tunnel** → a subdomain like `hooks.quantratech.co.za` mapped to
   `127.0.0.1:5678`. More setup, but lets you expose only the webhook path + adds WAF.

3. **n8n Cloud / a tiny VPS** webhook — avoids exposing the NUC at all.

## n8n workflow ("Quantra — Website Leads")

Webhook (POST) → Send email → Discord ping → Respond 200.

- **Webhook node**: method `POST`, path `contact`, Response = "Using Respond to Webhook".
  **Set "Allowed Origins (CORS)" = `https://quantratech.co.za`** (the browser does a
  cross-origin POST — without this it's blocked). Also allow `https://www.quantratech.co.za`.
- **(optional) Honeypot drop**: IF `{{$json.body.company_url}}` is non-empty → stop
  (client already guards, this is belt-and-braces).
- **Email**: SMTP node via GWS app password (or reuse your existing mail path) → to
  `zuaan@quantratech.co.za`, subject `New website lead: {{name}} ({{source}})`, body =
  the payload fields.
- **Discord**: HTTP Request `POST https://discord.com/api/channels/<DISCORD_LEADS_CHANNEL_ID>/messages`
  header `Authorization: Bot {{$env.LIFE_OS_BOT_TOKEN}}` (same bot/path as
  `jarvisreminders1`), body `{"content":"🟢 New lead — **{{name}}** / {{company}} / {{email}} · source `{{source}}`\n> {{bottleneck}}"}`.
  Add a `#leads` channel + put its id in `~/docker/n8n/.env` as `DISCORD_LEADS_CHANNEL_ID`.
- **Respond to Webhook**: status `200`, body `{"ok":true}`, header
  `Access-Control-Allow-Origin: https://quantratech.co.za` (belt-and-braces with the CORS setting).

Build it the same way as the other JARVIS workflows (`~/docker/n8n/build_*.py` →
`docker exec n8n n8n import:workflow …` → `publish:workflow` → `docker compose restart n8n`).

## Go-live checklist

1. Expose n8n (option 1/2/3 above) → get the public webhook URL.
2. Build + activate the n8n workflow; test with `curl -X POST <url> -H 'Content-Type: application/json' -d '{"name":"Test","email":"t@t.co","company":"X","bottleneck":"y","source":"test"}'` → expect email + Discord ping.
3. Set `CONTACT_ENDPOINT = '<public webhook URL>'` in `js/main.js`.
4. Submit the real form from the deployed site; confirm redirect to `/thank-you` + lead arrives.
5. (Optional) add **Cloudflare Turnstile** to the form (you've done this on ConveyClear) — verify the token server-side in the n8n workflow before accepting.

## Notes
- `FALLBACK_EMAIL` in `js/main.js` is currently `zuaan@quantratech.co.za` (used by the
  mailto fallback). Consider a `hello@`/`leads@` alias so a personal address isn't in
  client JS (minor spam-scrape exposure).
- Honeypot field = `company_url` (hidden via `.hp-field`); real users never see it.
