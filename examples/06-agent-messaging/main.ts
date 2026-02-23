// Example: Send agent-to-agent messages (P2P).
// Run: API_KEY=cai_... npx tsx main.ts

const API_KEY = process.env.API_KEY!;
const BASE = process.env.API_BASE || "https://api.personal.ai/v1";

async function main() {
  // Send a message to another user's agent.
  console.log("Sending message...");
  const send = await fetch(`${BASE}/agent/message`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: "alice@example.com",
      content: "Hey, can you share your travel recommendations for Japan?",
    }),
  });
  console.log("Sent:", await send.json());

  // List threads.
  const threads = await fetch(`${BASE}/agent/threads`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });
  console.log("\nThreads:", await threads.json());
}

main().catch(console.error);
