// Example: OAuth 2.0 third-party app that accesses a user's Personal AI.
// Run: CLIENT_ID=cai_app_... CLIENT_SECRET=cai_secret_... npx tsx server.ts

import { createServer } from "http";

const CLIENT_ID = process.env.CLIENT_ID!;
const CLIENT_SECRET = process.env.CLIENT_SECRET!;
const REDIRECT_URI = "http://localhost:4000/callback";
const AUTH_BASE = process.env.AUTH_BASE || "https://api.personal.ai";
const API_BASE = process.env.API_BASE || "https://api.personal.ai/v1";

const server = createServer(async (req, res) => {
  const url = new URL(req.url!, `http://localhost:4000`);

  if (url.pathname === "/") {
    // Step 1: Redirect user to Personal AI for authorization.
    const authURL = new URL(`${AUTH_BASE}/oauth/authorize`);
    authURL.searchParams.set("client_id", CLIENT_ID);
    authURL.searchParams.set("redirect_uri", REDIRECT_URI);
    authURL.searchParams.set("scope", "memory:read agent:run");
    authURL.searchParams.set("state", "csrf-random-token");
    res.writeHead(302, { Location: authURL.toString() });
    res.end();
    return;
  }

  if (url.pathname === "/callback") {
    // Step 2: Exchange authorization code for access token.
    const code = url.searchParams.get("code")!;
    const state = url.searchParams.get("state");
    console.log(`Got code: ${code}, state: ${state}`);

    const tokenResp = await fetch(`${AUTH_BASE}/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
      }),
    });
    const token = await tokenResp.json();
    console.log("Access token:", token.access_token);

    // Step 3: Use the token to call the API.
    const claims = await fetch(`${API_BASE}/memory/claims`, {
      headers: { Authorization: `Bearer ${token.access_token}` },
    }).then((r) => r.json());

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
      <h1>Connected!</h1>
      <p>Found ${claims.length} memory claims.</p>
      <pre>${JSON.stringify(claims.slice(0, 5), null, 2)}</pre>
    `);
    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

server.listen(4000, () => {
  console.log("OAuth app running on http://localhost:4000");
  console.log("Visit http://localhost:4000 to start the OAuth flow");
});
