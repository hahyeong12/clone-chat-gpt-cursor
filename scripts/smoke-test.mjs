// 2026 verification script. Not part of the original 2025 application.
// This checks technical behavior only; it does NOT validate medical advice.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const port = 3100;
const base = `http://127.0.0.1:${port}`;
const child = spawn("npm", ["run", "start", "--", "-p", String(port)], {
  detached: process.platform !== "win32",
  stdio: ["ignore", "pipe", "pipe"],
  env: { ...process.env, PORT: String(port) },
});
let output = "";
for (const stream of [child.stdout, child.stderr]) {
  stream.setEncoding("utf8");
  stream.on("data", (chunk) => {
    output = (output + chunk).slice(-4000);
  });
}
const terminate = () => {
  if (child.exitCode !== null) return;
  try {
    if (process.platform !== "win32") process.kill(-child.pid, "SIGTERM");
    else child.kill("SIGTERM");
  } catch { /* already stopped */ }
};
process.once("exit", terminate);

function report(name) {
  console.log(`PASS: ${name}`);
}
async function getResponse(path, init = {}) {
  return fetch(base + path, { ...init, signal: AbortSignal.timeout(45000) });
}

try {
  let ready = false;
  for (let i = 0; i < 90; i++) {
    if (child.exitCode !== null) throw new Error("Server process exited early");
    try {
      const response = await fetch(base + "/home", { signal: AbortSignal.timeout(2000) });
      if (response.status === 200) { ready = true; break; }
    } catch { /* waiting for startup */ }
    await sleep(1000);
  }
  assert.ok(ready, "Server did not become ready in 90 seconds");
  report("production Next.js server started");

  const home = await getResponse("/home");
  const homeHtml = await home.text();
  assert.equal(home.status, 200);
  assert.ok(homeHtml.includes("약장수"));
  assert.ok(homeHtml.includes("타이레놀정"), "expected static medication entries");
  report("GET /home returns medication search UI HTML");

  const chat = await getResponse("/");
  const chatHtml = await chat.text();
  assert.equal(chat.status, 200);
  assert.ok(chatHtml.includes("약장수 챗봇"));
  assert.ok(chatHtml.includes("로그인"));
  report("GET / returns chatbot and login UI HTML");

  const invalid = await getResponse("/api/chat", {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ messages: [] }),
  });
  assert.equal(invalid.status, 400);
  const invalidJson = await invalid.json();
  assert.equal(invalidJson?.error?.code, "BAD_REQUEST");
  report("POST /api/chat rejects empty message arrays with HTTP 400");

  async function sendChat(content, userId) {
    const response = await getResponse("/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content }],
        ...(userId ? { userId } : {}),
      }),
    });
    assert.equal(response.status, 200);
    assert.ok(response.headers.get("content-type")?.includes("text/event-stream"));
    const body = await response.text();
    assert.ok(body.includes("data: [DONE]"), "missing SSE end marker");
    assert.ok(!body.includes("data: [ERROR]"), "server emitted stream error");
    // The 2025 app emits one SSE data line per character. Rejoin the data values
    // before comparing complete Korean phrases; checking raw lines would be false.
    const assembled = body
      .split(/\r?\n/)
      .filter((line) => line.startsWith("data: "))
      .map((line) => line.slice(6))
      .filter((chunk) => chunk !== "[DONE]")
      .join("");
    return assembled;
  }

  const greeting = await sendChat("안녕하세요");
  assert.ok(greeting.includes("약장수 챗봇"));
  report("chat API streams a greeting (SSE)");

  const symptom = await sendChat("두통이 있어요", "user002");
  assert.ok(symptom.includes("추천 약물"), "expected rule-based medication response");
  report("chat API streams rule-based symptom matching (SSE)");

  console.log("RESULT: 6/6 HTTP smoke checks passed");
} catch (error) {
  console.error("FAILED:", error?.stack ?? error);
  console.error("Server log (tail):", output);
  process.exitCode = 1;
} finally {
  terminate();
}
