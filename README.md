<div align="center">

# 🧠 Personal AI

### Your AI knows you. Now let it work for you everywhere.

Build apps that understand context, remember everything, and act on your behalf.

[Get API Key](https://app.continua.ai/settings/api) · [API Reference](docs/api-reference.md) · [Examples](examples/) · [OpenAPI Spec](openapi/openapi.json)

---

</div>

## What is this?

Personal AI is the first AI that builds a persistent, private model of *you* — from conversations, phone events, connected services, and daily context. This repo gives you everything you need to build on top of it.

**Your AI already knows your preferences, schedule, relationships, and habits.** These APIs let you tap into that intelligence from any app.

```bash
# Your AI remembers you love cortados from Blue Bottle
curl "https://api.continua.ai/personal/v1/memory/claims/search?q=coffee" \
  -H "Authorization: Bearer cai_YOUR_KEY"

# Ask your AI anything — it reasons over everything it knows about you
curl -X POST https://api.continua.ai/personal/v1/agent/run \
  -H "Authorization: Bearer cai_YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"message": "What should I get Mom for her birthday?"}'

# Spin up an interactive poll in one call
curl -X POST https://api.continua.ai/personal/v1/flux/create \
  -H "Authorization: Bearer cai_YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Friday dinner vote: Italian, Thai, or BBQ?"}'
```

<br>

## The APIs

<table>
<tr>
<td width="50%" valign="top">

### 🧩 Memory
Read, search, and shape your AI's knowledge. Every claim is a fact your AI has learned about you — preferences, habits, relationships, opinions.

```bash
# What does my AI think I like?
curl ".../v1/memory/claims?category=preference" \
  -H "Authorization: Bearer $KEY"
```

</td>
<td width="50%" valign="top">

### 🤖 Agent
Run your personal AI agent. It reasons over your full memory, uses tools, and gives answers that are uniquely *yours*. Supports SSE streaming.

```bash
# Streaming agent response
curl -X POST .../v1/agent/run \
  -H "Accept: text/event-stream" \
  -d '{"message": "Plan my weekend"}'
```

</td>
</tr>
<tr>
<td width="50%" valign="top">

### ⚡ Flux
Create interactive mini-apps from natural language. Polls, planners, dashboards, games — generated and embeddable anywhere.

```bash
curl -X POST .../v1/flux/create \
  -d '{"prompt": "Expense splitter for 4 people"}'
# Returns app_url + iframe embed code
```

</td>
<td width="50%" valign="top">

### 🔌 Connectors
Connect your AI to 61+ web services with a single API call. OAuth, API keys, cookies, linking codes — all handled automatically. Credentials are stored securely and health-checked.

```bash
# Connect your Stripe account
curl -X POST .../v1/catalog/connect \
  -d '{"entry_id": "stripe", "api_key": "sk_..."}'
# → Your AI can now read your Stripe data
```

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 📡 Feeds
Publish real-time slices of your AI's memory. Other users' AIs subscribe and act automatically. Publishers earn 70% of credits consumed.

```bash
# Publish a local weather feed
curl -X POST .../v1/feeds \
  -d '{"name": "SoMa Weather", "type": "status",
       "lat": 37.78, "lng": -122.39}'
```

</td>
<td width="50%" valign="top">

### 🔔 Webhooks & OAuth 2.0
Get notified in real-time. Build third-party apps with standard OAuth consent flow.

```bash
curl -X POST .../v1/webhooks \
  -d '{"url": "https://you.com/hook",
       "events": ["agent.run.completed",
                   "memory.claim.created"]}'
```

</td>
</tr>
</table>

<br>

## 5-Minute Quickstart

### 1. Get your key

Go to [app.continua.ai/settings/api](https://app.continua.ai/settings/api) → **Create API Key** → copy it. It starts with `cai_` and you only see it once.

### 2. Talk to your AI

```bash
export KEY="cai_your_key_here"

# What does my AI know about me?
curl https://api.continua.ai/personal/v1/memory/claims/profile \
  -H "Authorization: Bearer $KEY" | jq .

# Ask it something personal
curl -X POST https://api.continua.ai/personal/v1/agent/run \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -d '{"message": "Remind me what I said about that restaurant last week"}'
```

### 3. Create something interactive

```bash
# A Flux app — generated UI from just a sentence
curl -X POST https://api.continua.ai/personal/v1/flux/create \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Gift idea brainstorm board for Christmas"}' | jq .app_url
```

### 4. Connect your services

Your AI becomes dramatically more useful when it can see your world. Connect services and your AI auto-generates skills to act on your behalf.

```bash
# What services can my AI connect to?
curl "https://api.continua.ai/personal/v1/catalog/search?q=google" \
  -H "Authorization: Bearer $KEY"
# → Google Calendar, Gmail, Google Drive, Google Maps...

# Connect Google Calendar (OAuth — you'll get a redirect URL)
curl -X POST https://api.continua.ai/personal/v1/catalog/connect \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -d '{"entry_id": "google-calendar"}'
# → {"status": "oauth_redirect", "oauth_url": "https://accounts.google.com/..."}

# Connect OpenAI (API key — instant)
curl -X POST https://api.continua.ai/personal/v1/catalog/connect \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -d '{"entry_id": "openai", "api_key": "sk-..."}'
# → {"status": "connected", "skill_name": "openai", "skill": "# OpenAI\n..."}

# See all your connections with live health status
curl https://api.continua.ai/personal/v1/catalog/connections \
  -H "Authorization: Bearer $KEY"
# → [{"entry": {"display_name": "OpenAI"}, "status": "connected"}, ...]

# Verify a specific connection still works
curl -X POST https://api.continua.ai/personal/v1/catalog/connections/openai/verify \
  -H "Authorization: Bearer $KEY"
# → {"status": "connected", "http_status": 200}
```

### 5. Publish and subscribe to feeds

Feeds are how AIs share real-time intelligence. A coffee shop publishes wait times; your AI notices you're nearby and craving coffee. A transit feed publishes delays; your AI reroutes your commute.

```bash
# Publish a feed (you earn credits when others subscribe)
curl -X POST https://api.continua.ai/personal/v1/feeds \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Downtown Coffee Status",
    "type": "commerce",
    "description": "Live wait times and specials from 3 coffee shops",
    "lat": 37.7849, "lng": -122.4094,
    "cost_per_update": 2,
    "visibility": "public"
  }'

# Push an update to your feed
curl -X POST "https://api.continua.ai/personal/v1/feeds/FEED_ID/publish" \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -d '{"content": "Blue Bottle: 2 min wait. Philz: 8 min. Sightglass: closed for renovation."}'

# Discover feeds near a location
curl "https://api.continua.ai/personal/v1/feeds/discover?lat=37.78&lng=-122.41&radius_m=1000" \
  -H "Authorization: Bearer $KEY"

# Subscribe (your AI gets updates automatically)
curl -X POST "https://api.continua.ai/personal/v1/feeds/FEED_ID/subscribe" \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -d '{"budget": 100}'

# Stream updates in real-time (SSE)
curl "https://api.continua.ai/personal/v1/feeds/FEED_ID/stream" \
  -H "Authorization: Bearer $KEY"

# Check your earnings as a publisher
curl https://api.continua.ai/personal/v1/feeds/analytics/overview \
  -H "Authorization: Bearer $KEY"
# → {"total_earned": 4200, "total_subscribers": 37, "active_feeds": 3}
```

### 6. Get notified

```bash
curl -X POST https://api.continua.ai/personal/v1/webhooks \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://yourapp.com/hooks", "events": ["agent.run.completed"]}'
# Save the whsec_... secret for HMAC verification
```

<br>

## Examples

Working apps you can run in 30 seconds:

| # | Example | What it does | Run |
|---|---|---|---|
| 01 | [Memory Search](examples/01-memory-search/) | Search and display memory claims | `npx tsx main.ts` |
| 02 | [Agent Run](examples/02-agent-run/) | Stream agent responses via SSE | `npx tsx main.ts` |
| 03 | [Flux App](examples/03-flux-app/) | Create + interact with a Flux app | `npx tsx main.ts` |
| 04 | [Webhooks](examples/04-webhooks/) | Receive + verify webhook deliveries | `npx tsx main.ts` |
| 05 | [Scheduling](examples/05-scheduling/) | Create cron-style scheduled tasks | `npx tsx main.ts` |
| 06 | [Agent Messaging](examples/06-agent-messaging/) | Agent-to-agent P2P messages | `npx tsx main.ts` |
| 07 | [OAuth App](examples/07-oauth-app/) | Full OAuth 2.0 third-party app | `npx tsx server.ts` |
| 08 | [Feed Publisher](examples/08-feed-publisher/) | Publish a real-time feed + earn credits | `npx tsx main.ts` |
| 09 | [Feed Subscriber](examples/09-feed-subscriber/) | Discover, subscribe, + stream feed updates | `npx tsx main.ts` |
| 10 | [Service Connector](examples/10-service-connector/) | Browse 61+ services, connect, verify health | `npx tsx main.ts` |

Every example uses plain `fetch` — no SDK, no wrapper library, no dependencies beyond the runtime. Just HTTP.

<br>

## Authentication

```
Authorization: Bearer cai_YOUR_API_KEY
```

Keys use the `cai_` prefix (52 chars total). Stored as SHA-256 hashes — the raw key is shown exactly once at creation.

For **WebSocket** connections (which can't send headers), pass the key as a query param:

```javascript
new WebSocket(`wss://api.continua.ai/personal/v1/feeds/${id}/ws?token=${key}`)
```

### Scopes

| Scope | What it unlocks |
|---|---|
| `memory:read` | Claims, search, profile, feed discovery, analytics |
| `memory:write` | Edit/delete claims, create feeds, publish updates |
| `agent:run` | Execute agent runs |
| `skills:read` | Browse skills |
| `skills:write` | Publish skills |
| `flux:create` | Create Flux apps |
| `flux:interact` | Interact, read state, WebSocket |
| `catalog:read` | Browse catalog, list connections, verify health |
| `catalog:write` | Connect and disconnect services |
| `schedule:write` | Scheduled tasks |
| `p2p:message` | Agent-to-agent messaging |

<br>

## Pricing

See [continua.ai/pricing](https://continua.ai/pricing) for current plans and credit costs.

<br>

## What's in this repo

```
README.md              ← You are here
docs/
  api-reference.md     ← Every endpoint, every parameter, every response
  getting-started.md   ← 5-minute quickstart
  authentication.md    ← Keys, scopes, OAuth 2.0, WebSocket auth
  feeds.md             ← Publishing, subscribing, channels, earnings
  webhooks.md          ← Events, signatures, retry policy
  billing.md           ← Plans, credits, overage, publisher payouts
examples/              ← 10 working apps (TypeScript, plain fetch)
openapi/
  openapi.json         ← OpenAPI 3.1 spec (auto-generated from server)
docs-site/
  index.html           ← Hosted API docs (dark theme, all endpoints)
```

<br>

## Links

- **API Base**: `https://api.continua.ai/personal/v1`
- **OpenAPI Spec**: `https://api.continua.ai/personal/v1/openapi.json`
- **Developer Dashboard**: [app.continua.ai/settings/api](https://app.continua.ai/settings/api)
- **Pricing**: [continua.ai/pricing](https://continua.ai/pricing)
- **Status**: [status.continua.ai](https://status.continua.ai)

<br>

<div align="center">

---

**Built by [Continua AI](https://continua.ai)** · MIT License

*The AI that remembers who you are.*

</div>
