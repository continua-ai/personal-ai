# Memory Feeds

Feeds are the killer feature that makes Personal AI a platform, not just a chatbot.

**The idea**: You publish curated slices of your AI's memory as real-time streams. Other users' AIs subscribe and act on that information automatically. You earn credits.

This isn't social media. Nobody scrolls feeds. Your AI decides which feeds matter right now, subscribes with a budget, and takes action when something relevant changes.

## Why this is different

- **No subscription fatigue** — Credits are fungible. Your AI subscribes/unsubscribes based on context. A rarely-used feed costs almost nothing.
- **Machine-readable, not human-readable** — Feed items are structured key-value data that AIs consume. The `summary` field is a human-readable fallback.
- **Publishers are incentivized by quality** — You earn more when your feed is genuinely useful. Bad feeds get no subscribers.
- **AI-managed budgets** — Your AI watches your context and automatically follows relevant feeds within your credit budget.

## Create a feed

```bash
curl -X POST https://api.continua.ai/personal/v1/feeds \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Downtown Café Status",
    "description": "Real-time wait times and table availability",
    "type": "status",
    "tags": ["café", "downtown", "food"],
    "cost_per_update": 2,
    "location": {
      "lat": 37.7749,
      "lng": -122.4194,
      "radius_m": 500,
      "zone": "downtown SF"
    }
  }'
```

### Feed types

| Type | What it's for | Example |
|---|---|---|
| `presence` | Availability, location zone | "Working from café until 3pm" |
| `inventory` | Stock, capacity | "3 standing desks available" |
| `status` | Wait times, conditions | "12 min wait, patio open" |
| `interests` | Recommendations | "Obsessed with ceramics this month" |
| `household` | Home state | "Dishwasher needs unloading" |
| `commerce` | Pricing, deals | "20% off pastries after 4pm" |
| `community` | Events, alerts | "Block party Saturday 2-6pm" |
| `health` | Wellness | "Squat rack free at Gold's Gym" |
| `profession` | Expert availability | "Accepting consulting calls Tuesdays" |

### Visibility

| Level | Who can find it |
|---|---|
| `public` | Anyone via discovery |
| `contacts` | Only your contacts |
| `link` | Anyone with the feed ID |
| `private` | Explicit invitations only |

## Publish an update

```bash
curl -X POST https://api.continua.ai/personal/v1/feeds/{feed_id}/publish \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "tables_available": "5",
      "wait_minutes": "0",
      "specials": "Lavender latte"
    },
    "summary": "5 tables open, no wait. Today: lavender latte"
  }'
```

Every subscriber is charged `cost_per_update` credits when they receive this.

## Discover feeds

```bash
# By type
curl ".../v1/feeds/discover?type=status"

# By tag
curl ".../v1/feeds/discover?tag=café"

# By text
curl ".../v1/feeds/discover?q=parking"

# By location (haversine distance)
curl ".../v1/feeds/discover?lat=37.77&lng=-122.42&radius_m=2000"

# Combine them
curl ".../v1/feeds/discover?type=status&tag=food&lat=37.77&lng=-122.42&radius_m=1000"
```

## Subscribe

```bash
curl -X POST https://api.continua.ai/personal/v1/feeds/{feed_id}/subscribe \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -d '{"budget": 100}'
```

`budget` is max credits per month for this feed. `0` means unlimited (within your plan).

When spending hits the budget, delivery stops — your AI can reallocate budget from less useful feeds.

## Real-time streaming

### Server-Sent Events (SSE)

```bash
curl https://api.continua.ai/personal/v1/feeds/{feed_id}/stream \
  -H "Authorization: Bearer $KEY" \
  -H "Accept: text/event-stream"
```

Sends `event: latest` with the most recent item, then `event: update` for each new publish.

### WebSocket

```javascript
const ws = new WebSocket(
  `wss://api.continua.ai/personal/v1/feeds/${feedId}/ws?token=${apiKey}`
);

ws.onmessage = (event) => {
  const item = JSON.parse(event.data);
  console.log(`${item.summary}`);
  console.log(item.data);  // structured key-value pairs
};
```

Both require an active subscription.

## Channels

Curators bundle feeds into themed packages with optional markup:

```bash
curl -X POST https://api.continua.ai/personal/v1/channels \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Downtown SF Food Scene",
    "description": "Every café, restaurant, and food truck downtown",
    "feed_ids": ["feed_abc", "feed_def", "feed_ghi"],
    "markup_pct": 15
  }'
```

Markup is capped at 50%. Revenue flows: subscriber pays → curator takes markup → rest split 70/30 between publisher and Continua.

## Publisher analytics

```bash
# Dashboard: total feeds, subscribers, earnings
curl ".../v1/feeds/analytics/overview" -H "Authorization: Bearer $KEY"

# Per-feed: subscriber list, recent items, live connections
curl ".../v1/feeds/{id}/analytics" -H "Authorization: Bearer $KEY"

# Top feeds ranked by estimated revenue
curl ".../v1/feeds/analytics/top" -H "Authorization: Bearer $KEY"

# Earnings for a period
curl ".../v1/feeds/earnings?period=2026-02-01" -H "Authorization: Bearer $KEY"
```

## Revenue share

| Recipient | Share |
|---|---|
| **Publisher** | 70% |
| **Continua** | 30% |
| **Curator** | Up to 50% markup (taken before the 70/30 split) |

Example: Feed costs 10 credits. Consumed via a channel with 20% markup.

- Curator: 2 credits (20%)
- Publisher: 5.6 credits (70% of remaining 8)
- Continua: 2.4 credits (30% of remaining 8)

Earnings are paid monthly via Stripe Connect.
