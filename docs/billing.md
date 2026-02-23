# Billing & Credits

## How it works

Every API call costs credits. Credits are a single currency — they absorb the wildly different backend costs (LLM inference, vector search, real-time delivery) so you don't have to think about it.

## Plans

See [continua.ai/pricing](https://continua.ai/pricing) for current plans, credit allowances, and rate limits.

A free tier is included — no credit card required.

## What things cost

Get the current cost table programmatically (no auth required):

```bash
curl https://api.continua.ai/personal/v1/credits/costs
```

## Check your balance

```bash
curl https://api.continua.ai/personal/v1/credits/balance \
  -H "Authorization: Bearer $KEY"
```

## Overage

- **Free plan**: Hard block at 0 credits. Upgrade or wait for next month.
- **Paid plans**: Overage is allowed and billed at the end of the cycle as metered usage via Stripe.

## Publisher earnings

When you publish a feed, subscribers' AIs pay credits to consume your updates. You earn 70%.

| Recipient | Share |
|---|---|
| Publisher | 70% |
| Continua | 30% |
| Curator | Up to 50% markup (if consumed via a channel) |

### Check your earnings

```bash
curl https://api.continua.ai/personal/v1/feeds/earnings \
  -H "Authorization: Bearer $KEY"

# Specific period
curl "https://api.continua.ai/personal/v1/feeds/earnings?period=2026-01-01" \
  -H "Authorization: Bearer $KEY"
```

### Getting paid

Earnings are paid out monthly via Stripe Connect. Set up your payout account in the publisher dashboard. Minimum payout: $1.00. Below-minimum balances roll over to the next period.

## Transaction history

```bash
curl https://api.continua.ai/personal/v1/credits/transactions \
  -H "Authorization: Bearer $KEY"
```

Each transaction shows the endpoint, credit cost, and remaining balance.
