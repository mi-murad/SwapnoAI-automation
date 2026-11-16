# Daily performance report workflow
Cron: 08:30 Asia/Dhaka. Fetch account insights for previous Bangladesh calendar day; normalize and upsert metrics; join store orders/refunds; calculate CTR/CPC/CPA/ROAS only when denominators and data exist; invoke reporting agent; save report and notify owner. Retry transient 429/5xx with backoff. Mark stale data; missing conversions are not zero conversions.
