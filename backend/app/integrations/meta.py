class MetaAdsAdapter:
    def __init__(self, access_token: str, api_version: str, ad_account_id: str):
        self.access_token = access_token
        self.api_version = api_version
        self.ad_account_id = ad_account_id

    async def fetch_account_insights(self, account_id: str, date_from: str, date_to: str):
        # TODO: implement current Meta Marketing API Insights endpoint, pagination,
        # rate limits, retries and server-side token vault.
        raise NotImplementedError("Meta read-only Insights integration not configured.")

    async def create_campaign(self, approved_payload: dict):
        # Intentionally disabled until approval persistence, policy checks and idempotency exist.
        raise NotImplementedError("Meta publishing is disabled in this starter.")
