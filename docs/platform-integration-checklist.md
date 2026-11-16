# Platform integration checklist
## Meta first
Create developer app; configure Marketing API; implement OAuth and secure token storage; begin read-only account/Insights access; verify account ownership, currency and permissions; implement pagination, retries, rate limits, refresh and webhook verification; enable campaign writes only after approval and policy checks.

## Google later
Set up Cloud project, OAuth, developer token and customer IDs; test read-only reporting; pin and maintain API version.

## TikTok later
Set up Business developer app, advertiser authorization and Marketing API access; verify account/region eligibility; implement reporting before writes.

Verify current official API documentation and access requirements before implementation. Never commit secrets.
