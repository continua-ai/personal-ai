// Example: Run the Personal AI agent with streaming.
// Run: API_KEY=cai_... npx tsx main.ts

const API_KEY = process.env.API_KEY!;
const BASE = process.env.API_BASE || "https://api.continua.ai/personal/v1";

async function syncRun() {
  console.log("--- Sync agent run ---");
  const resp = await fetch(`${BASE}/agent/run`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: "Summarize what you know about me" }),
  });
  const result = await resp.json();
  console.log("Response:", result.content);
  console.log(`(${result.iterations} iterations, ${result.duration_ms}ms)`);
}

async function streamingRun() {
  console.log("\n--- Streaming agent run ---");
  const resp = await fetch(`${BASE}/agent/run`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify({ message: "Write a haiku about my interests" }),
  });

  const reader = resp.body!.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const text = decoder.decode(value);
    for (const line of text.split("\n")) {
      if (line.startsWith("data: ")) {
        const data = JSON.parse(line.slice(6));
        if (data.done) {
          console.log("\n[done]");
        } else {
          process.stdout.write(data.delta);
        }
      }
    }
  }
}

async function main() {
  await syncRun();
  await streamingRun();
}

main().catch(console.error);
