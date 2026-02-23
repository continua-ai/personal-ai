# Getting Started

You can go from zero to talking to your AI in about 90 seconds.

## 1. Get an API key

[app.personal.ai/settings/api](https://app.personal.ai/settings/api) → **Create API Key** → select scopes → copy.

The key starts with `cai_` and is shown exactly once. Store it somewhere safe.

## 2. Say hello

```bash
export KEY="cai_your_key_here"

curl https://api.personal.ai/v1/memory/claims/profile \
  -H "Authorization: Bearer $KEY" | jq .
```

This returns a personality profile derived from everything your AI has learned about you.

## 3. Search your memory

```bash
curl "https://api.personal.ai/v1/memory/claims/search?q=favorite+restaurants" \
  -H "Authorization: Bearer $KEY" | jq '.[].content'
```

## 4. Ask your AI

```bash
# Synchronous
curl -X POST https://api.personal.ai/v1/agent/run \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -d '{"message": "What should I have for dinner tonight?"}'

# Streaming (SSE) — responses appear as they're generated
curl -X POST https://api.personal.ai/v1/agent/run \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -d '{"message": "Plan my weekend"}'
```

## 5. Create something

```bash
# A Flux app — interactive UI from a sentence
curl -X POST https://api.personal.ai/v1/flux/create \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Movie night vote for Saturday"}' | jq .app_url
```

Open the URL — it's a live, shareable, interactive app.

## 6. Discover feeds nearby

```bash
curl "https://api.personal.ai/v1/feeds/discover?lat=37.77&lng=-122.42&radius_m=2000" \
  -H "Authorization: Bearer $KEY" | jq '.[].name'
```

## Next steps

- [Full API Reference](api-reference.md) — every endpoint, every parameter
- [Authentication](authentication.md) — scopes, OAuth, WebSocket auth
- [Feeds](feeds.md) — publish, subscribe, earn credits
- [Webhooks](webhooks.md) — real-time event notifications
- [Billing](billing.md) — plans, credits, publisher payouts
- [Examples](../examples/) — 9 working apps you can run in 30 seconds
