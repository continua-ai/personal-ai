// Example: Subscribe to webhook events and verify signatures.
// Run: API_KEY=cai_... npx tsx main.ts

import { createHmac } from "crypto";
import { createServer } from "http";

const API_KEY = process.env.API_KEY!;
const BASE = process.env.API_BASE || "https://api.continua.ai/personal/v1";

// In production, use your public HTTPS URL.
const WEBHOOK_URL = process.env.WEBHOOK_URL || "https://yourapp.ngrok.io/webhook";

async function main() {
  // Create a webhook subscription.
  console.log("Creating webhook subscription...");
  const resp = await fetch(`${BASE}/webhooks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: WEBHOOK_URL,
      events: ["agent.run.completed", "memory.claim.created"],
    }),
  });
  const sub = await resp.json();
  console.log("Subscription:", sub.id);
  console.log("Secret:", sub.secret);
  console.log("SAVE THIS SECRET — it won't be shown again.\n");

  // Start a local server to receive webhooks (for demo).
  const server = createServer((req, res) => {
    let body = "";
    req.on("data", (chunk: string) => (body += chunk));
    req.on("end", () => {
      const signature = req.headers["x-webhook-signature"] as string;
      const expected = createHmac("sha256", sub.secret).update(body).digest("hex");
      const valid = signature === expected;
      console.log(`[webhook] ${valid ? "✓" : "✗"} ${JSON.parse(body).type}`);
      res.writeHead(200);
      res.end("ok");
    });
  });
  server.listen(3000, () => console.log("Webhook receiver on :3000"));

  // List subscriptions.
  const list = await fetch(`${BASE}/webhooks`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  }).then((r) => r.json());
  console.log("\nActive subscriptions:", list.length);
}

main().catch(console.error);
