# Activepieces flow blueprints

Use the Activepieces hosted Free plan initially (100 credits/day at time checked) or self-host the Community Edition. The exported flow format changes between releases, so create these flows in the UI using the exact steps below rather than importing a brittle hand-written JSON export.

## Flow A — Create campaign draft (webhook)
1. Trigger: Webhook → Catch Webhook (POST).
2. Add a Branch/Condition: require `business_id`, `product_name`, `product_description`, `destination_type`, and `platform`.
3. HTTP → Send Request: POST `{{ADS_MANAGER_API_URL}}/api/campaigns/draft`.
4. Headers: `Authorization: Bearer {{ADS_MANAGER_INTERNAL_TOKEN}}`; `Content-Type: application/json`.
5. Body: pass the validated webhook JSON unchanged.
6. Respond to Webhook with backend response. Do not add a publish step.

## Flow B — Daily performance report (scheduled)
1. Trigger: Schedule, daily at 09:00 Asia/Dhaka.
2. HTTP GET `/api/campaigns?business_id={{BUSINESS_ID}}` with internal bearer token.
3. For each campaign, request metrics from the backend once the platform reporting adapters are connected.
4. Summarize spend, purchases, attributed revenue, ROAS and order/refund reconciliation.
5. Send report to your chosen notification destination. Report missing integrations as unavailable, never as zero spend.

## Flow C — Pending approval notification (scheduled)
1. Trigger: Schedule every 15 minutes (or use a webhook when approval events are implemented).
2. HTTP GET `/api/approvals/pending?business_id={{BUSINESS_ID}}`.
3. Notify the owner with campaign name, platform, daily budget and proposed creative.
4. The notification is informational. Approval must happen in the authenticated dashboard; never approve by reacting to a notification.

## Secrets
Store `ADS_MANAGER_API_URL`, `ADS_MANAGER_INTERNAL_TOKEN`, and business IDs in Activepieces connections/secret fields, not in flow text or public webhook payloads. Keep the Supabase service-role key exclusively in the backend environment.
