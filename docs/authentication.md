# Authentication

## API Keys

Every `/v1/` request needs a Bearer token:

```
Authorization: Bearer cai_YOUR_KEY
```

Keys are 52 characters: `cai_` prefix + 48 hex characters (24 random bytes). They're stored as SHA-256 hashes — the raw key is shown once at creation, never again.

### Create a key

From the dashboard at [app.continua.ai/settings/api](https://app.continua.ai/settings/api), or programmatically:

```bash
curl -X POST https://api.continua.ai/personal/api/keys \
  -H "X-User-Email: you@example.com" \
  -H "Content-Type: application/json" \
  -d '{"name": "my-app", "scopes": ["memory:read", "agent:run"]}'
```

### Scopes

| Scope | What it unlocks |
|---|---|
| `memory:read` | Claims, search, profile, feed discovery, analytics |
| `memory:write` | Edit/delete claims, create/publish feeds, channels |
| `agent:run` | Execute agent runs |
| `skills:read` | Browse skills |
| `skills:write` | Publish and install skills |
| `flux:create` | Create Flux apps |
| `flux:interact` | Interact with Flux apps, state, WebSocket |
| `catalog:read` | Browse catalog, list connections, verify health |
| `catalog:write` | Connect and disconnect services |
| `schedule:write` | Create and manage scheduled tasks |
| `p2p:message` | Agent-to-agent messaging |

## WebSocket Auth

WebSocket connections can't send the `Authorization` header. Pass the API key as a `token` query parameter instead:

```javascript
// Feed stream
new WebSocket(`wss://api.continua.ai/personal/v1/feeds/${feedId}/ws?token=${apiKey}`)

// Flux real-time updates
new WebSocket(`wss://api.continua.ai/personal/v1/flux/${appId}/ws?token=${apiKey}`)
```

The server validates the key and checks scopes before upgrading the connection.

## OAuth 2.0

For apps that access other users' Personal AI on their behalf. Standard authorization code flow.

### Register your app

```bash
curl -X POST https://api.continua.ai/personal/oauth/apps \
  -H "X-User-Email: dev@yourapp.com" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My App",
    "redirect_uris": ["https://yourapp.com/callback"]
  }'
```

Save the `client_id` and `client_secret`.

### Authorization flow

**Step 1** — Redirect user to authorize:

```
https://api.continua.ai/personal/oauth/authorize
  ?client_id=cai_app_...
  &redirect_uri=https://yourapp.com/callback
  &scope=memory:read+agent:run
  &state=random-csrf-token
```

**Step 2** — User approves → redirected to your URI with `?code=AUTH_CODE`

**Step 3** — Exchange code for token:

```bash
curl -X POST https://api.continua.ai/personal/oauth/token \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "authorization_code",
    "code": "AUTH_CODE",
    "client_id": "cai_app_...",
    "client_secret": "cai_secret_...",
    "redirect_uri": "https://yourapp.com/callback"
  }'
```

**Step 4** — Use the access token like any other API key:

```bash
curl https://api.continua.ai/personal/v1/memory/claims \
  -H "Authorization: Bearer cai_THE_ACCESS_TOKEN"
```

Auth codes expire after 10 minutes and can only be used once.

## Rate Limits

Every response includes rate limit headers:

```
X-RateLimit-Limit: 5000
X-RateLimit-Remaining: 4999
X-RateLimit-Reset: 1709251200
```

When you hit the limit, you'll get a `429` with a `Retry-After` header.
