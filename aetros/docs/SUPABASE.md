# Supabase — Aetros

## Linked project

| Field | Value |
|-------|-------|
| **Name** | ESG COMMUNITY PLATFORM |
| **Project ref** | `dyqgnbjphdvhpnkclyyh` |
| **URL** | `https://dyqgnbjphdvhpnkclyyh.supabase.co` |
| **Region** | ap-southeast-1 |

## Local setup

1. Copy env file:
   ```bash
   cp .env.example .env
   ```
2. Paste **anon public key** from Supabase Dashboard → Settings → API.
3. Set `VITE_USE_SUPABASE=true`
4. Restart dev server: `npm run dev`

## CLI link (already configured)

```bash
cd aetros
npx supabase link --project-ref dyqgnbjphdvhpnkclyyh
```

## Schema note

This Supabase project uses the **ESG platform schema** (`actions_log`, `profiles`, `posts`, …) from the shared backend — not the sample files in `supabase/migrations/001_*.sql` (those are reference only).

The app calls:

- `profiles` — user XP & carbon credits
- `actions_log` — action history
- RPC `log_action(p_action_type, p_xp, p_credits, p_note)` — requires Supabase Auth session

Anonymous sign-in runs on app boot when Supabase is enabled.

## GitHub

Repo: `https://github.com/wakiattisak2-rgb/ESG-Community-Platform.git`

**Never commit `.env`** — it is gitignored.
