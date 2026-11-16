# AI Ads Manager Dashboard

Next.js 14 + React + TypeScript dashboard. The first version is intentionally demo-only: products, campaign drafts and approval decisions are held in browser memory and reset on refresh. No ad accounts are connected and no ads are published.

## Run on Windows 10

```powershell
cd frontend
npm install
npm run dev
```

Open http://localhost:3000.

## Notes
- The current dashboard is a UI prototype with local demo interactions.
- Do not put Supabase service-role keys or ad platform tokens in browser code.
- The next integration step is a server-side Next.js route proxy to FastAPI, with owner authentication and persistent approvals before any live publish endpoint is implemented.
