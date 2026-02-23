// Example: Subscribe to a feed and stream real-time updates via SSE.
// Run: API_KEY=cai_... FEED_ID=feed_... npx tsx main.ts

const API_KEY = process.env.API_KEY!;
const FEED_ID = process.env.FEED_ID!;
const BASE = process.env.API_BASE || "https://api.continua.ai/personal/v1";

const headers = { Authorization: `Bearer ${API_KEY}` };

async function main() {
  // Subscribe (with a 100-credit monthly budget).
  console.log(`Subscribing to ${FEED_ID}...`);
  const subRes = await fetch(`${BASE}/feeds/${FEED_ID}/subscribe`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ budget: 100 }),
  });
  const sub = await subRes.json();
  console.log(`Subscribed: ${sub.feed_name} (budget: ${sub.budget} credits/mo)`);

  // Stream updates via SSE.
  console.log("\nStreaming updates (Ctrl+C to stop):\n");
  const stream = await fetch(`${BASE}/feeds/${FEED_ID}/stream`, {
    headers: { ...headers, Accept: "text/event-stream" },
  });

  if (!stream.body) {
    console.error("No response body — streaming not supported?");
    return;
  }

  const reader = stream.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const item = JSON.parse(line.slice(6));
        const time = new Date(item.created_at).toLocaleTimeString();
        console.log(`[${time}] ${item.summary}`);
        if (item.data) {
          for (const [k, v] of Object.entries(item.data)) {
            console.log(`         ${k}: ${v}`);
          }
        }
        console.log();
      }
    }
  }
}

main().catch(console.error);
