// Example: Search memory claims using the Personal AI API.
// Run: API_KEY=cai_... npx tsx main.ts

const API_KEY = process.env.API_KEY!;
const BASE = process.env.API_BASE || "https://api.personal.ai/v1";

async function main() {
  // List all claims.
  const claims = await fetch(`${BASE}/memory/claims`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  }).then((r) => r.json());
  console.log("Claims:", claims.length);

  // Search for coffee-related claims.
  const results = await fetch(`${BASE}/memory/claims/search?q=coffee`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  }).then((r) => r.json());
  console.log("Coffee claims:", results);

  // Get personality profile.
  const profile = await fetch(`${BASE}/memory/claims/profile`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  }).then((r) => r.json());
  console.log("Profile:", profile);

  // Check credit balance.
  const balance = await fetch(`${BASE}/credits/balance`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  }).then((r) => r.json());
  console.log("Credits remaining:", balance.available, "/", balance.monthly_credits);
}

main().catch(console.error);
