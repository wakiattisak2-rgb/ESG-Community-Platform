# Deploy Aetros on Vercel

## Option A — Import from GitHub (recommended)

1. Open [vercel.com/new](https://vercel.com/new)
2. Import **`wakiattisak2-rgb/ESG-Community-Platform`**
3. Project settings:
   - **Root Directory:** `aetros` (click Edit → select `aetros`)
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. **Environment Variables** (Production + Preview):

   | Name | Value |
   |------|-------|
   | `VITE_SUPABASE_URL` | `https://dyqgnbjphdvhpnkclyyh.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | *(anon key from Supabase Dashboard → Settings → API)* |
   | `VITE_USE_SUPABASE` | `true` |

5. Deploy

## Option B — Vercel CLI

```bash
cd aetros
npx vercel login
npx vercel link
npx vercel env add VITE_SUPABASE_URL
npx vercel env add VITE_SUPABASE_ANON_KEY
npx vercel env add VITE_USE_SUPABASE
npx vercel --prod
```

## Supabase auth for production

In Supabase Dashboard → **Authentication → URL Configuration**, add your Vercel URL:

- Site URL: `https://your-project.vercel.app`
- Redirect URLs: `https://your-project.vercel.app/**`

Enable **Anonymous sign-in** under Authentication → Providers.

## SPA routing

`vercel.json` rewrites all routes to `index.html` for React Router.
