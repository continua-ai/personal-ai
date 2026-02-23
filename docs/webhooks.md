# Webhooks

Get notified when things happen in Personal AI — agent runs complete, memory changes, Flux apps update.

## Create a subscription

```bash
curl -X POST https://api.continua.ai/personal/v1/webhooks \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://yourapp.com/webhooks/personal-ai",
    "events": ["agent.run.completed", "memory.claim.created"]
  }'
```

The response includes a signing secret — **save it**, it's only shown once:

```json
{
  "id": "wh_abc123",
  "url": "https://yourapp.com/webhooks/personal-ai",
  "events": ["agent.run.completed", "memory.claim.created"],
  "secret": "whsec_..."
}
```

URLs must be HTTPS (except `localhost` for development).

## Events

| Event | Fires when |
|---|---|
| `agent.run.completed` | An agent run finishes (success or error) |
| `memory.claim.created` | A new memory claim is extracted |
| `memory.claim.updated` | A claim's content or metadata changes |
| `memory.claim.deleted` | A claim is deleted |
| `flux.app.created` | A new Flux app is generated |
| `flux.interaction` | Someone interacts with a Flux app |

## Verify signatures

Every delivery includes an `X-Webhook-Signature` header — the HMAC-SHA256 of the raw request body using your signing secret.

**Node.js:**

```javascript
import crypto from 'crypto';

function verify(body, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}
```

**Python:**

```python
import hmac, hashlib

def verify(payload: bytes, signature: str, secret: str) -> bool:
    expected = hmac.new(secret.encode(), payload, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)
```

Always verify signatures before processing events.

## Retry policy

| Attempt | Delay |
|---|---|
| 1st retry | ~1 second |
| 2nd retry | ~5 seconds |
| 3rd retry | ~25 seconds |

After **10 consecutive failures**, the webhook is automatically disabled. Check status and re-enable via `GET /v1/webhooks`.

## Manage subscriptions

```bash
# List all
GET /v1/webhooks

# Delete
DELETE /v1/webhooks/{id}
```
