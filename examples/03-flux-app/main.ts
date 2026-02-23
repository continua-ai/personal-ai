// Example: Create a Flux app and interact with it.
// Run: API_KEY=cai_... npx tsx main.ts

const API_KEY = process.env.API_KEY!;
const BASE = process.env.API_BASE || "https://api.continua.ai/personal/v1";

async function main() {
  // Create a poll.
  console.log("Creating Flux app...");
  const create = await fetch(`${BASE}/flux/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt: "Team lunch poll: pizza, sushi, or tacos?" }),
  });
  const app = await create.json();
  console.log("App created:", app.app_id);
  console.log("URL:", app.app_url);
  console.log("Embed:", app.embed);

  // Vote.
  console.log("\nVoting for sushi...");
  const vote = await fetch(`${BASE}/flux/${app.app_id}/interact`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ intent: "vote", data: { choice: "sushi" } }),
  });
  console.log("Vote result:", await vote.json());

  // Check state.
  console.log("\nFetching app state...");
  const state = await fetch(`${BASE}/flux/${app.app_id}/state`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });
  console.log("State:", await state.json());

  // WebSocket for real-time updates.
  console.log("\nTo watch real-time updates:");
  console.log(`  wscat -c "wss://api.continua.ai/personal/v1/flux/${app.app_id}/ws"`);
}

main().catch(console.error);
