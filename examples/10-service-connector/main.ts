// Example: Service connector — browse catalog, connect services, check health
//
// Shows how to:
// 1. Browse the service catalog
// 2. Connect a service with an API key
// 3. List connections with health status
// 4. Verify a specific connection
// 5. Disconnect a service

const API = process.env.API_BASE || "https://api.continua.ai/personal/v1";
const KEY = process.env.PERSONAL_AI_KEY!;

const headers = {
  Authorization: `Bearer ${KEY}`,
  "Content-Type": "application/json",
};

async function main() {
  // 1. Browse the catalog
  console.log("=== Service Catalog ===");
  const catalogRes = await fetch(`${API}/catalog`, { headers });
  const catalog = await catalogRes.json();
  console.log(`${catalog.length} services available\n`);

  // Show first 5 by category
  const byCategory: Record<string, string[]> = {};
  for (const entry of catalog) {
    (byCategory[entry.category] ??= []).push(entry.display_name);
  }
  for (const [cat, services] of Object.entries(byCategory).slice(0, 5)) {
    console.log(`  ${cat}: ${services.slice(0, 3).join(", ")}...`);
  }

  // 2. Search for a specific service
  console.log("\n=== Search: 'openai' ===");
  const searchRes = await fetch(`${API}/catalog/search?q=openai`, { headers });
  const matches = await searchRes.json();
  if (matches.length > 0) {
    const entry = matches[0];
    console.log(`  ${entry.display_name} (${entry.auth_method})`);
    console.log(`  "${entry.value_prop}"`);

    // 3. Connect with an API key
    console.log("\n=== Connect OpenAI ===");
    const connectRes = await fetch(`${API}/catalog/connect`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        entry_id: entry.id,
        api_key: process.env.OPENAI_API_KEY ?? "sk-demo",
      }),
    });
    const connection = await connectRes.json();
    console.log(`  Status: ${connection.status}`);
    console.log(`  Skill: ${connection.skill_name}`);
    console.log(`  Auth flow: ${connection.auth_flow}`);
  }

  // 4. List all connections with health
  console.log("\n=== Connections ===");
  const connRes = await fetch(`${API}/catalog/connections`, { headers });
  const connections = await connRes.json();
  for (const conn of connections.filter((c: { status: string }) => c.status === "connected")) {
    console.log(`  ✅ ${conn.entry.display_name} — ${conn.status}`);
  }

  // 5. Verify a specific connection
  if (matches.length > 0) {
    console.log("\n=== Verify OpenAI ===");
    const verifyRes = await fetch(`${API}/catalog/connections/openai/verify`, {
      method: "POST",
      headers,
    });
    const result = await verifyRes.json();
    console.log(`  Status: ${result.status}`);
    if (result.hint) console.log(`  Hint: ${result.hint}`);
    if (result.http_status) console.log(`  HTTP: ${result.http_status}`);

    // 6. Disconnect
    console.log("\n=== Disconnect OpenAI ===");
    const disconnRes = await fetch(`${API}/catalog/connections/openai`, {
      method: "DELETE",
      headers,
    });
    console.log(`  ${disconnRes.status === 204 ? "Disconnected ✓" : "Failed"}`);
  }
}

main().catch(console.error);
