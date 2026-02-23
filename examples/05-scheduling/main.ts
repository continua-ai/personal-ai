// Example: Create and manage scheduled tasks.
// Run: API_KEY=cai_... npx tsx main.ts

const API_KEY = process.env.API_KEY!;
const BASE = process.env.API_BASE || "https://api.continua.ai/personal/v1";

async function main() {
  // Create a daily morning briefing.
  console.log("Creating daily briefing schedule...");
  const create = await fetch(`${BASE}/schedule`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      kind: "morning-briefing",
      schedule: "0 8 * * *",
      message: "Give me my morning briefing with weather, calendar, and news",
    }),
  });
  console.log("Created:", await create.json());

  // List schedules.
  const list = await fetch(`${BASE}/schedule`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });
  console.log("\nSchedules:", await list.json());

  // Delete.
  await fetch(`${BASE}/schedule/morning-briefing`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${API_KEY}` },
  });
  console.log("\nDeleted morning-briefing schedule");
}

main().catch(console.error);
