<div align="center">

# 🧠 Personal AI

### Your AI knows you. Now let it work for you everywhere.

Build apps that understand context, remember everything, and act on your behalf.

[Get API Key](https://app.personal.ai/settings/api) · [API Reference](docs/api-reference.md) · [Examples](examples/) · [OpenAPI Spec](openapi/openapi.json)

---

</div>

## What is this?

Personal AI is the first AI that builds a persistent, private model of *you* — from conversations, phone events, connected services, and daily context. This repo gives you everything you need to build on top of it.

**Your AI already knows your preferences, schedule, relationships, and habits.** These APIs let you tap into that intelligence from any app.

```bash
# Your AI remembers you love cortados from Blue Bottle
curl "https://api.personal.ai/v1/memory/claims/search?q=coffee" \
  -H "Authorization: Bearer cai_YOUR_KEY"

# Ask your AI anything — it reasons over everything it knows about you
curl -X POST https://api.personal.ai/v1/agent/run \
  -H "Authorization: Bearer cai_YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"message": "What should I get Mom for her birthday?"}'

# Spin up an interactive poll in one call
curl -X POST https://api.personal.ai/v1/flux/create \
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

### 📡 Feeds
Publish real-time slices of your AI's memory. Other users' AIs subscribe and act automatically. Publishers earn 70% of credits consumed.

```bash
curl -X POST .../v1/feeds \
  -d '{"name": "Café Status", "type": "status",
       "cost_per_update": 2}'
```

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🔔 Webhooks
Get notified in real-time when things happen. Agent runs complete, memory changes, Flux apps update. HMAC-SHA256 signed.

```bash
curl -X POST .../v1/webhooks \
  -d '{"url": "https://you.com/hook",
       "events": ["agent.run.completed"]}'
```

</td>
<td width="50%" valign="top">

### 🔑 OAuth 2.0
Build third-party apps that access users' Personal AI on their behalf. Standard authorization code flow.

```
GET /oauth/authorize?client_id=...
    &redirect_uri=https://you.com/cb
    &scope=memory:read+agent:run
```

</td>
</tr>
</table>

<br>

## 5-Minute Quickstart

### 1. Get your key

Go to [app.personal.ai/settings/api](https://app.personal.ai/settings/api) → **Create API Key** → copy it. It starts with `cai_` and you only see it once.

### 2. Talk to your AI

```bash
export KEY="cai_your_key_here"

# What does my AI know about me?
curl https://api.personal.ai/v1/memory/claims/profile \
  -H "Authorization: Bearer $KEY" | jq .

# Ask it something personal
curl -X POST https://api.personal.ai/v1/agent/run \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -d '{"message": "Remind me what I said about that restaurant last week"}'
```

### 3. Create something interactive

```bash
# A Flux app — generated UI from just a sentence
curl -X POST https://api.personal.ai/v1/flux/create \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Gift idea brainstorm board for Christmas"}' | jq .app_url
```

### 4. Subscribe to real-time feeds

```bash
# Find feeds near you
curl "https://api.personal.ai/v1/feeds/discover?lat=37.77&lng=-122.42&radius_m=2000" \
  -H "Authorization: Bearer $KEY"

# Subscribe and stream updates
curl -X POST "https://api.personal.ai/v1/feeds/FEED_ID/subscribe" \
  -H "Authorization: Bearer $KEY" \
  -d '{"budget": 100}'

# Real-time via SSE
curl "https://api.personal.ai/v1/feeds/FEED_ID/stream" \
  -H "Authorization: Bearer $KEY"
```

### 5. Connect a service

```bash
# Browse 61+ services
curl "https://api.personal.ai/v1/catalog/search?q=stripe" \
  -H "Authorization: Bearer $KEY"

# Connect with an API key
curl -X POST https://api.personal.ai/v1/catalog/connect \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -d '{"entry_id": "stripe", "api_key": "sk_live_..."}'

# Check connection health
curl -X POST "https://api.personal.ai/v1/catalog/connections/stripe/verify" \
  -H "Authorization: Bearer $KEY"
```

### 6. Get notified

```bash
curl -X POST https://api.personal.ai/v1/webhooks \
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
| 08 | [Feed Publisher](examples/08-feed-publisher/) | Publish a real-time feed | `npx tsx main.ts` |
| 09 | [Feed Subscriber](examples/09-feed-subscriber/) | Subscribe + stream feed updates | `npx tsx main.ts` |
| 10 | [Service Connector](examples/10-service-connector/) | Browse catalog, connect, verify health | `npx tsx main.ts` |

Every example uses plain `fetch` — no SDK, no wrapper library, no dependencies beyond the runtime. Just HTTP.

<br>

## Authentication

```
Authorization: Bearer cai_YOUR_API_KEY
```

Keys use the `cai_` prefix (52 chars total). Stored as SHA-256 hashes — the raw key is shown exactly once at creation.

For **WebSocket** connections (which can't send headers), pass the key as a query param:

```javascript
new WebSocket(`wss://api.personal.ai/v1/feeds/${id}/ws?token=${key}`)
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

Credits are a single currency that absorbs variable backend costs. Your AI manages spend automatically.

| Plan | Price | Credits/mo | Requests/min |
|---|---|---|---|
| **Free** | $0 | 1,000 | 100 |
| **Developer** | $29/mo | 50,000 | 5,000 |
| **Team** | $99/mo | 500,000 | 20,000 |
| **Enterprise** | Custom | 10M+ | 100,000 |

<details>
<summary><strong>Credit costs per endpoint</strong></summary>

| Endpoint | Credits |
|---|---|
| Memory reads | 1 |
| Skills / catalog reads | 1 |
| Memory writes | 2 |
| Scheduling | 2 |
| Flux interact | 2 |
| P2P messaging | 3 |
| Agent run | 5 |
| Flux create | 10 |
| Feed updates | 1–10 (publisher sets) |
| Webhooks / OpenAPI | Free |

</details>

<details>
<summary><strong>Publisher earnings</strong></summary>

Feed publishers earn credits when subscribers consume updates:

- **70%** → Publisher
- **30%** → Platform
- Up to **50% markup** for channel curators

Earnings are paid monthly via Stripe Connect.

</details>

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
examples/              ← 9 working apps (TypeScript, plain fetch)
openapi/
  openapi.json         ← OpenAPI 3.1 spec (auto-generated from server)
docs-site/
  index.html           ← Hosted API docs (dark theme, all endpoints)
```

<br>

## Links

- **API Base**: `https://api.personal.ai/v1`
- **OpenAPI Spec**: `https://api.personal.ai/v1/openapi.json`
- **Developer Dashboard**: [app.personal.ai/settings/api](https://app.personal.ai/settings/api)
- **Status**: [status.continua.ai](https://status.continua.ai)

<br>

<div align="center">

---

**Built by [Continua AI](https://continua.ai)** · MIT License

*The AI that remembers who you are.*

</div>
