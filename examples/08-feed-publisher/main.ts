// Example: Publish a real-time feed that other AIs can subscribe to.
// Run: API_KEY=cai_... npx tsx main.ts

const API_KEY = process.env.API_KEY!;
const BASE = process.env.API_BASE || "https://api.continua.ai/personal/v1";

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
};

async function main() {
  // Create a café status feed.
  console.log("Creating feed...");
  const createRes = await fetch(`${BASE}/feeds`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: "Downtown Café Status",
      description: "Real-time wait times and specials",
      type: "status",
      tags: ["café", "downtown", "coffee"],
      cost_per_update: 2,
      visibility: "public",
      location: { lat: 37.7749, lng: -122.4194, radius_m: 500, zone: "SF" },
    }),
  });
  const feed = await createRes.json();
  console.log(`Feed created: ${feed.id} — ${feed.name}`);

  // Publish updates every 10 seconds.
  let tables = 8;
  const specials = ["Lavender latte", "Oat cortado", "Cold brew flight", "Matcha tiramisu"];

  setInterval(async () => {
    tables = Math.max(0, tables + Math.floor(Math.random() * 5) - 2);
    const special = specials[Math.floor(Math.random() * specials.length)];
    const wait = tables === 0 ? Math.floor(Math.random() * 15) + 5 : 0;

    const res = await fetch(`${BASE}/feeds/${feed.id}/publish`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        data: {
          tables_available: String(tables),
          wait_minutes: String(wait),
          special_today: special,
        },
        summary: `${tables} tables, ${wait}min wait. Special: ${special}`,
      }),
    });
    const item = await res.json();
    console.log(`Published: ${item.summary}`);
  }, 10_000);

  console.log("Publishing updates every 10s. Press Ctrl+C to stop.");
}

main().catch(console.error);
