import secrets
from datetime import datetime, timezone
from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel, Field
from typing import Literal
from app.config import settings
from app.services.policy import BudgetPolicy, validate_draft_budget
from app.services.database import get_supabase

app = FastAPI(title="AI Ads Manager API", version="0.2.0")
policy = BudgetPolicy(monthly_cap_bdt=settings.monthly_budget_cap_bdt,
                      daily_cap_bdt=settings.daily_budget_cap_bdt)

class DraftRequest(BaseModel):
    business_id: str
    product_name: str = Field(min_length=1, max_length=160)
    product_description: str = Field(min_length=1, max_length=2000)
    destination_type: Literal["social_inbox", "landing_page", "website"]
    destination_url: str | None = None
    platform: Literal["meta", "google", "tiktok"] = "meta"
    daily_budget_bdt: int = Field(default=333, ge=100, le=333)
    audience_notes: str | None = None
    offer: str | None = None


def require_internal_token(authorization: str | None):
    expected = settings.internal_api_token
    if not expected:
        raise HTTPException(status_code=503, detail="Set INTERNAL_API_TOKEN before enabling write endpoints")
    supplied = (authorization or "").removeprefix("Bearer ")
    if not secrets.compare_digest(supplied, expected):
        raise HTTPException(status_code=401, detail="Invalid API token")

@app.get("/health")
async def health():
    return {"status": "ok", "environment": settings.app_env,
            "database_connected": get_supabase() is not None}

@app.get("/api/config")
async def config():
    return {"currency": "BDT", "timezone": "Asia/Dhaka",
            "monthly_budget_bdt": policy.monthly_cap_bdt,
            "daily_budget_cap_bdt": policy.daily_cap_bdt,
            "launch_requires_approval": True,
            "automatic_budget_increase": False,
            "platforms": ["meta", "google", "tiktok"]}

@app.post("/api/campaigns/draft")
async def create_draft(req: DraftRequest, authorization: str | None = Header(default=None)):
    require_internal_token(authorization)
    try:
        validate_draft_budget(req.daily_budget_bdt, policy)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    if req.destination_type != "social_inbox" and not req.destination_url:
        raise HTTPException(status_code=422, detail="destination_url is required for landing_page or website")
    sb = get_supabase()
    if sb is None:
        raise HTTPException(status_code=503, detail="Supabase is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.")

    draft = {
        "campaign_name": f"{req.product_name} - Bangladesh Sales Test",
        "platform": req.platform, "objective": "sales",
        "destination_type": req.destination_type, "destination_url": req.destination_url,
        "daily_budget_bdt": req.daily_budget_bdt,
        "primary_text": [
            f"Discover {req.product_name}. Message us to learn more.",
            f"Looking for {req.product_name}? Explore the details today."
        ],
        "headlines": [f"Discover {req.product_name}", f"Learn more about {req.product_name}"],
        "status": "draft", "ai_generated": False,
        "review_note": "Template draft: review product claims, price, offer and destination before use."
    }
    try:
        campaign_result = sb.table("campaigns").insert({
            "business_id": req.business_id, "platform": req.platform,
            "name": draft["campaign_name"], "objective": "sales", "status": "pending_approval",
            "daily_budget_bdt": req.daily_budget_bdt,
            "monthly_budget_cap_bdt": policy.monthly_cap_bdt,
            "config": {**draft, "product_name": req.product_name,
                       "product_description": req.product_description,
                       "audience_notes": req.audience_notes, "offer": req.offer}
        }).execute()
        campaign = campaign_result.data[0]
        approval_result = sb.table("approvals").insert({
            "business_id": req.business_id, "campaign_id": campaign["id"],
            "action_type": "launch_campaign", "proposed_change": draft,
            "status": "pending"
        }).execute()
        return {"status": "pending_approval", "ai_enabled": False,
                "approval_required": True, "campaign_id": campaign["id"],
                "approval_id": approval_result.data[0]["id"], "draft": draft}
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Could not save draft: {str(exc)}")

@app.get("/api/campaigns")
async def list_campaigns(business_id: str, authorization: str | None = Header(default=None)):
    require_internal_token(authorization)
    sb = get_supabase()
    if sb is None:
        raise HTTPException(status_code=503, detail="Supabase is not configured")
    result = sb.table("campaigns").select("*").eq("business_id", business_id).order("created_at", desc=True).execute()
    return {"items": result.data}

@app.get("/api/approvals/pending")
async def pending_approvals(business_id: str, authorization: str | None = Header(default=None)):
    require_internal_token(authorization)
    sb = get_supabase()
    if sb is None:
        raise HTTPException(status_code=503, detail="Supabase is not configured")
    result = sb.table("approvals").select("*").eq("business_id", business_id).eq("status", "pending").order("requested_at", desc=True).execute()
    return {"items": result.data}

@app.post("/api/campaigns/{campaign_id}/publish")
async def publish_campaign(campaign_id: str):
    raise HTTPException(status_code=403,
        detail="Publishing is intentionally disabled in this MVP. Implement owner-authenticated approval and platform adapter before enabling live ads.")
