# AI Ads Manager — Bangladesh Ecommerce MVP

Multi-business, semi-autonomous advertising starter. Defaults: Bangladesh, BDT, Asia/Dhaka, sales objective, ৳10,000 monthly portfolio cap, ৳333 planning daily cap. Start with Meta read-only; Google and TikTok are later adapters.

AI may research, draft, analyze and recommend. New campaign publishing and budget increases require owner approval. Automatic budget increases are disabled. This starter does not connect accounts or publish ads.

## Setup
1. Create Supabase project and run `database/schema.sql`.
2. Copy `backend/.env.example` to `backend/.env`.
3. Install: `pip install -r backend/requirements.txt`.
4. Run: `uvicorn app.main:app --app-dir backend --reload`.
5. Import `automation/workflows/campaign-draft-approval.json` into n8n.
6. Configure credentials as server-side secrets, never in workflow JSON or source control.

Production work still required: OAuth, platform permissions, current API versions, webhook verification, persistent approvals, idempotency, attribution, monitoring, rate limiting, security review and deployment.

## Dashboard (new)
The Next.js dashboard is in `frontend/`. On Windows PowerShell:

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`. The dashboard currently runs in DEMO MODE: sample products, campaign drafts and local approval actions are held in browser memory and reset on refresh. No platform accounts are connected and no advertisements are published. See `frontend/README.md` for details.
