class TikTokAdsAdapter:
    async def fetch_account_insights(self, account_id: str, date_from: str, date_to: str):
        raise NotImplementedError("Implement TikTok advertiser authorization and reporting.")

    async def create_campaign(self, approved_payload: dict):
        raise NotImplementedError("TikTok Ads publishing not configured.")
