from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_env: str = "development"
    app_secret: str = "development-only-change-me"
    internal_api_token: str = ""
    openai_api_key: str | None = None
    openai_model: str = "gpt-4.1-mini"
    supabase_url: str | None = None
    supabase_service_role_key: str | None = None
    default_currency: str = "BDT"
    default_timezone: str = "Asia/Dhaka"
    monthly_budget_cap_bdt: int = 10000
    daily_budget_cap_bdt: int = 333
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
