# My Planner Reminder Worker

This repository now contains the Cloudflare Worker used to trigger the existing Supabase `send-reminders` Edge Function.

## Already configured in code

- Worker name: `myplanner-reminder-cron`
- Cron schedule: every minute (`* * * * *`)
- Supabase target: `https://tskpdopzrqfqgtmjneiq.supabase.co/functions/v1/send-reminders`
- Worker source: `src/reminder-worker.js`
- Cloudflare config: `wrangler.jsonc`

## One secret required in Cloudflare

Create an encrypted Worker secret named:

`CRON_SECRET`

Its value must be the same current cron secret already configured for the Supabase `send-reminders` function.

Never commit the value of `CRON_SECRET` to GitHub.

## Git deployment

Connect this GitHub repository to the Cloudflare Worker. Cloudflare can deploy directly from `main` using:

`npx wrangler deploy`

The cron trigger is read from `wrangler.jsonc`, so there is no need to create the cron schedule manually in the dashboard.

## Health check

After deployment, open:

`https://myplanner-reminder-cron.hchaman64.workers.dev/health`

Expected JSON includes:

`"ok": true`

and after the secret is added:

`"cronSecretConfigured": true`
