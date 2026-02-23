# Billing & Credits

## How it works

Every API call costs credits. Credits are a single currency — they absorb the wildly different backend costs (LLM inference, vector search, real-time delivery) so you don't have to think about it.

## Plans

| Plan | Price | Credits/mo | Requests/min | Projects | Members |
|---|---|---|---|---|---|
| **Free** | $0 | 1,000 | 100 | 1 | 2 |
| **Developer** | $29/mo | 50,000 | 5,000 | 5 | 5 |
| **Team** | $99/mo | 500,000 | 20,000 | 20 | 25 |
| **Enterprise** | Custom | 10M+ | 100,000 | Unlimited | Unlimited |

## What things cost

| Endpoint | Credits | Why |
|---|---|---|
| Memory reads | 1 | DB lookup |
| Skills / catalog reads | 1 | DB lookup |
| Attention / bandwidth | 1 | DB lookup |
| Memory writes | 2 | Write + reindex |
| Catalog connect | 2 | Write + auth |
| Scheduling | 2 | Write + cron registration |
| Flux interact / state | 2 | State mutation + fan-out |
| P2P messaging | 3 | Delivery + storage |
| Agent run | 5 | LLM inference + tool use |
| Flux create | 10 | LLM generation + hosting |
| Feed updates | 1–10 | Set by publisher per feed |
| Webhooks, OpenAPI | 0 | Free |

Get the current cost table programmatically:

```bash
curl https://api.personal.ai/v1/credits/costs   # no auth required
```

## Check your balance

```bash
curl https://api.personal.ai/v1/credits/balance \
  -H "Authorization: Bearer $KEY"
```

## Overage

- **Free plan**: Hard block at 0 credits. Upgrade or wait for next month.
- **Paid plans**: Overage allowed at declining per-credit rates:

| Plan | Overage rate |
|---|---|
| Developer | $0.001/credit |
| Team | $0.0008/credit |
| Enterprise | $0.0005/credit |

Overage is reported to Stripe as metered usage and billed at the end of the cycle.

## Publisher earnings

When you publish a feed, subscribers' AIs pay credits to consume your updates. You earn 70%.

| Recipient | Share |
|---|---|
| Publisher | 70% |
| Continua | 30% |
| Curator | Up to 50% markup (if consumed via a channel) |

### Check your earnings

```bash
curl https://api.personal.ai/v1/feeds/earnings \
  -H "Authorization: Bearer $KEY"

# Specific period
curl "https://api.personal.ai/v1/feeds/earnings?period=2026-01-01" \
  -H "Authorization: Bearer $KEY"
```

### Getting paid

Earnings are paid out monthly via Stripe Connect. Set up your payout account in the publisher dashboard. Minimum payout: $1.00. Below-minimum balances roll over to the next period.

## Transaction history

```bash
curl https://api.personal.ai/v1/credits/transactions \
  -H "Authorization: Bearer $KEY"
```

Each transaction shows the endpoint, credit cost, and remaining balance.
