class GoogleAdsAdapter:
    async def fetch_account_insights(self, account_id: str, date_from: str, date_to: str):
        raise NotImplementedError("Implement Google Ads OAuth, developer token and reporting.")

    async def create_campaign(self, approved_payload: dict):
        raise NotImplementedError("Google Ads publishing not configured.")
