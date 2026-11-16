from pydantic import BaseModel, Field
from typing import Literal

Platform = Literal["meta", "google", "tiktok"]
DestinationType = Literal["social_inbox", "landing_page", "website"]

class CampaignDraftRequest(BaseModel):
    business_id: str
    product_name: str = Field(min_length=1, max_length=160)
    product_description: str = Field(min_length=1, max_length=2000)
    destination_type: DestinationType
    destination_url: str | None = None
    platform: Platform = "meta"
    daily_budget_bdt: int = Field(default=333, ge=100, le=10000)
    audience_notes: str | None = None
    offer: str | None = None
