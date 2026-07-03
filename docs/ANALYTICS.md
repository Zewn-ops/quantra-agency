# Analytics — self-hosted Umami (on the NUC)

Privacy-first, cookieless (POPIA-friendly) web analytics. No Google, no consent
banner needed for the analytics itself.

## What's deployed (NUC)

- **Stack:** `~/docker/umami/` — `umami` (Node app) + `umami-db` (Postgres 15), own
  Docker network. Image `ghcr.io/umami-software/umami:postgresql-latest`.
- **Bound:** `127.0.0.1:8300` (loopback only — not LAN, not internet yet).
- **Auto-start:** `restart: unless-stopped` → survives reboots on its own.
- **Admin:** user `admin`, password in `~/docker/umami/admin-credentials.txt` (chmod 600,
  never in chat). Default `umami/umami` was rotated immediately.
- **Website ID (public — goes in the tracking script):** `82fb35bc-fb2c-4645-a1a8-382e1b1db2e6`
  (name "Quantra Digital", domain `quantratech.co.za`).
- **Backup:** `~/docker/umami/backup.sh` — nightly `pg_dump | gzip` → `~/backups/umami/`,
  30-day retention. Tested. (Cron + `brain` lifecycle entry still to add — see below.)

## View the dashboard
```
ssh -L 8300:127.0.0.1:8300 nuc      # tunnel from your laptop
# then open http://localhost:8300  (login admin / <pw from admin-credentials.txt>)
```

## ⚠️ Blocker to go live: Umami must be PUBLIC
The tracking script (`/script.js`) and its collector (`/api/send`) load in visitors'
browsers, so the host must be public HTTPS. `127.0.0.1:8300` is LAN-only. Pick one:

1. **Tailscale Funnel** (fastest — no DNS change). Enable Funnel in the tailnet admin,
   then on the NUC:
   ```
   tailscale funnel --bg --https=443 http://127.0.0.1:8300
   ```
   → host `https://quantranuc.tail9a886e.ts.net`. Tracking src =
   `https://quantranuc.tail9a886e.ts.net/script.js`. Works (valid .ts.net cert);
   downside = unbranded host. (Also exposes the Umami login page publicly — admin pw is
   rotated, so acceptable.)
2. **Cloudflare Tunnel → `analytics.quantratech.co.za`** (cleaner, first-party = dodges
   ad-blockers, adds WAF). Requires moving `quantratech.co.za` DNS to Cloudflare (it's at
   `tld-ns.com` now). Bigger one-time step, but it ALSO solves the contact-form n8n webhook
   (`hooks.quantratech.co.za`) — one tunnel serves both.

## Add the tracking script (after exposure is chosen)
Inject into the `<head>` of all 9 pages:
```html
<script defer src="https://<ANALYTICS_HOST>/script.js" data-website-id="82fb35bc-fb2c-4645-a1a8-382e1b1db2e6"></script>
```
(Claude can do this across all pages once the host is known.)

## Persistence to authorize (blocked by the auto-mode classifier — run via `!` or approve)
Umami already auto-restarts via Docker; these just add lifecycle + nightly backups:
```
# add to the brain lifecycle (so `brain status/up/down` includes umami)
sudo sed -i '/\$HOME\/docker\/vaultwarden"/a\  "$HOME/docker/umami"' /usr/local/bin/brain
# nightly backup at 03:45
( crontab -l 2>/dev/null; echo "45 3 * * * /home/zewn/docker/umami/backup.sh >> /home/zewn/backups/umami/backup.log 2>&1" ) | crontab -
```

## Restore from backup
```
gunzip -c ~/backups/umami/umami-YYYYMMDD-HHMMSS.sql.gz | docker exec -i umami-db psql -U umami -d umami
```
