# API Reference

Base URL: `https://api.continua.ai/personal/v1`

All requests require `Authorization: Bearer cai_YOUR_KEY` unless noted otherwise.

---

## Memory

### List claims

```bash
GET /memory/claims
GET /memory/claims?category=preference
```

Returns active memory claims. Filter by category: `preference`, `habit`, `relationship`, `opinion`, `fact`.

### Search claims

```bash
GET /memory/claims/search?q=coffee
```

Semantic search across all claims.

### Personality profile

```bash
GET /memory/claims/profile
```

Derived personality model from the user's full memory.

### Update a claim

```bash
PUT /memory/claims/{id}
Content-Type: application/json

{"content": "Prefers oat milk", "reason": "user corrected"}
```

### Delete a claim

```bash
DELETE /memory/claims/{id}
```

### Change visibility

```bash
PUT /memory/claims/{id}/scope
Content-Type: application/json

{"scope": "contacts"}   # private | contacts | public
```

### Pin / unpin

```bash
PUT /memory/claims/{id}/pin
Content-Type: application/json

{"pinned": true}
```

### Revision history

```bash
GET /memory/claims/{id}/history
```

---

## Agent

### Run agent

```bash
POST /agent/run
Content-Type: application/json

{"message": "What should I have for dinner?"}
```

Add `Accept: text/event-stream` for SSE streaming.

**Response** (sync):

```json
{"content": "Based on what you've told me...", "iterations": "3", "duration_ms": "1523"}
```

### Send P2P message

```bash
POST /agent/message
Content-Type: application/json

{"to": "alice@example.com", "content": "Share your travel tips?"}
```

### List threads

```bash
GET /agent/threads
```

### Thread messages

```bash
GET /agent/threads/{id}/messages
```

---

## Flux

### Create app

```bash
POST /flux/create
Content-Type: application/json

{"prompt": "Team lunch poll: pizza, sushi, or tacos?"}
```

**Response**:

```json
{
  "app_id": "flux-abc123",
  "app_url": "https://flux.continua.ai/flux-abc123",
  "embed": "<iframe src=\"...\" width=\"100%\" height=\"600\"></iframe>"
}
```

### Interact

```bash
POST /flux/{app_id}/interact
Content-Type: application/json

{"intent": "vote", "data": {"choice": "sushi"}}
```

### Get state

```bash
GET /flux/{app_id}/state
```

### WebSocket (real-time)

```javascript
const ws = new WebSocket(
  `wss://api.continua.ai/personal/v1/flux/${appId}/ws?token=${apiKey}`
);
ws.onmessage = (e) => console.log(JSON.parse(e.data));
```

---

## Feeds

### Create feed

```bash
POST /feeds
Content-Type: application/json

{
  "name": "Downtown Café Status",
  "description": "Real-time wait times",
  "type": "status",
  "tags": ["café", "downtown"],
  "cost_per_update": 2,
  "visibility": "public",
  "location": {"lat": 37.7749, "lng": -122.4194, "radius_m": 500, "zone": "SF"}
}
```

Types: `presence` · `inventory` · `status` · `interests` · `household` · `commerce` · `community` · `health` · `profession`

Visibility: `public` · `contacts` · `link` · `private`

### List my feeds

```bash
GET /feeds
```

### Get feed

```bash
GET /feeds/{id}
```

### Delete feed

```bash
DELETE /feeds/{id}
```

### Publish update

```bash
POST /feeds/{id}/publish
Content-Type: application/json

{
  "data": {"tables_available": "5", "wait_minutes": "0"},
  "summary": "5 tables available, no wait"
}
```

### Discover feeds

```bash
GET /feeds/discover?type=status
GET /feeds/discover?tag=café
GET /feeds/discover?q=coffee
GET /feeds/discover?lat=37.77&lng=-122.42&radius_m=2000
```

### Subscribe

```bash
POST /feeds/{id}/subscribe
Content-Type: application/json

{"budget": 100}   # max credits/month, 0 = unlimited
```

### Unsubscribe

```bash
DELETE /feeds/{id}/subscribe
```

### List subscriptions

```bash
GET /feeds/subscriptions
```

### Stream (SSE)

```bash
GET /feeds/{id}/stream
Accept: text/event-stream
```

Requires active subscription. Sends `event: latest` (initial) then `event: update` for each new item.

### Stream (WebSocket)

```javascript
const ws = new WebSocket(
  `wss://api.continua.ai/personal/v1/feeds/${feedId}/ws?token=${apiKey}`
);
```

### Publisher analytics

```bash
GET /feeds/analytics/overview    # dashboard summary
GET /feeds/{id}/analytics        # per-feed detail
GET /feeds/analytics/top         # ranked by revenue
GET /feeds/earnings              # current period (or ?period=2026-01-01)
```

---

## Channels

### Create channel

```bash
POST /channels
Content-Type: application/json

{
  "name": "Downtown Food Scene",
  "description": "Best food feeds in downtown",
  "feed_ids": ["feed_abc", "feed_def"],
  "markup_pct": 15
}
```

### List channels

```bash
GET /channels
```

### Get channel

```bash
GET /channels/{id}
```

### Subscribe to channel

```bash
POST /channels/{id}/subscribe
```

---

## Skills

```bash
GET /skills                           # list skills
GET /skills/{name}                    # get skill details
```

---

## Service Catalog & Connections

The service catalog contains 61+ web services the AI can connect to. Connections store credentials and auto-generate skills so the agent can act on the user's behalf.

### Browse catalog

```bash
GET /catalog                          # all entries (builtin + user-added)
GET /catalog/search?q=calendar        # search by name/tags
```

Each entry includes: `id`, `display_name`, `auth_method` (oauth/api_key/cookie/linking_code/none), `category`, `tags`, `value_prop`, and `verified` status.

### Connect a service

Requires scope: `catalog:write`

```bash
# API key auth
curl -X POST https://api.continua.ai/personal/v1/catalog/connect \
  -H "Authorization: Bearer $API_KEY" \
  -d '{"entry_id": "openai", "api_key": "sk-..."}'

# Linking code auth
curl -X POST https://api.continua.ai/personal/v1/catalog/connect \
  -d '{"entry_id": "spotify", "linking_code": "123456"}'

# OAuth (returns redirect URL)
curl -X POST https://api.continua.ai/personal/v1/catalog/connect \
  -d '{"entry_id": "google-calendar"}'
# Response: {"status": "oauth_redirect", "oauth_url": "https://..."}
```

Response includes `status` (connected/oauth_redirect), `skill_name`, `skill` (SKILL.md content), `auth_flow`, and `credential_stored`.

### List connections with health status

```bash
GET /catalog/connections
```

Returns all services with connection status: `connected`, `needs_refresh`, `failed`, `pending`, or `not_connected`. Includes `hint` for fixing broken connections.

### Verify connection health

```bash
POST /catalog/connections/{service}/verify
```

Probes the service API with stored credentials. Returns detailed status including `http_status` and actionable `hint`.

### Disconnect

Requires scope: `catalog:write`

```bash
DELETE /catalog/connections/{service}
```

Removes credentials and connection record.

---

## Scheduling

```bash
POST /schedule     # {"kind": "daily-summary", "schedule": "0 8 * * *", "message": "Morning briefing"}
GET /schedule      # list
DELETE /schedule/{kind}
```

---

## Webhooks

### Create

```bash
POST /webhooks
Content-Type: application/json

{"url": "https://you.com/hook", "events": ["agent.run.completed"]}
```

Response includes `secret: "whsec_..."` — save it.

### List / Delete

```bash
GET /webhooks
DELETE /webhooks/{id}
```

### Events

| Event | When |
|---|---|
| `agent.run.completed` | Agent run finishes |
| `memory.claim.created` | New claim |
| `memory.claim.updated` | Claim changed |
| `memory.claim.deleted` | Claim deleted |
| `flux.app.created` | New Flux app |
| `flux.interaction` | Flux app interaction |

### Verify signatures

Every delivery has `X-Webhook-Signature` (HMAC-SHA256 of body):

```javascript
const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
```

---

## Credits & Billing

```bash
GET /credits/balance        # current balance
GET /credits/transactions   # recent transactions
GET /credits/costs          # cost table (no auth required)
```

---

## OAuth 2.0

For third-party apps acting on behalf of users.

```bash
# 1. Register app
POST /oauth/apps
{"name": "My App", "redirect_uris": ["https://you.com/callback"]}

# 2. Redirect user
GET /oauth/authorize?client_id=...&redirect_uri=...&scope=memory:read

# 3. Exchange code
POST /oauth/token
{"grant_type": "authorization_code", "code": "...", "client_id": "...",
 "client_secret": "...", "redirect_uri": "..."}

# 4. Use token
Authorization: Bearer cai_THE_ACCESS_TOKEN
```

---

## Devices

```bash
POST /devices/register
{"device_id": "iphone-14", "platform": "ios", "token": "APNs-token"}
```

---

## Attention & Bandwidth

```bash
GET /attention           # current focus state
GET /bandwidth/budget    # remaining proactive capacity
```

---

## OpenAPI Spec

```bash
GET /openapi.json   # no auth required
```

---

## Errors

```json
{"error": "descriptive message"}
```

| Status | Meaning |
|---|---|
| `400` | Bad request |
| `401` | Invalid or missing API key |
| `403` | Insufficient scope |
| `404` | Not found |
| `429` | Rate limit or credit quota exceeded |
| `500` | Server error |
