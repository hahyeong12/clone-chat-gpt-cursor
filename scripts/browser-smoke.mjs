// 2026 browser regression check. Preserves all 2025 app source unchanged.
// This tests UI mechanics only, not the medical correctness of recommendations.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { chromium } from "playwright";

const base = "http://127.0.0.1:3101";
const server = spawn("npm", ["run", "start", "--", "-p", "3101"], {
  detached: process.platform !== "win32",
  stdio: ["ignore", "pipe", "pipe"],
});
let log = "";
for (const stream of [server.stdout, server.stderr]) {
  stream.setEncoding("utf8");
  stream.on("data", (s) => { log = (log + s).slice(-3000); });
}
const stopServer = () => {
  try {
    if (process.platform !== "win32") process.kill(-server.pid, "SIGTERM");
    else server.kill("SIGTERM");
  } catch { /* already stopped */ }
};
let browser;
try {
  let ready = false;
  for (let i = 0; i < 90; i++) {
    if (server.exitCode !== null) throw new Error("Next.js process exited");
    try {
      const r = await fetch(base + "/home", { signal: AbortSignal.timeout(2000) });
      if (r.ok) { ready = true; break; }
    } catch {}
    await sleep(1000);
  }
  assert.ok(ready, "Server never started");
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ locale: "ko-KR" });
  page.setDefaultTimeout(12000);
  const browserErrors = [];
  page.on("pageerror", (e) => browserErrors.push(e.message));

  await page.goto(base + "/home", { waitUntil: "networkidle" });
  await page.getByText("총 20개의 약물 정보").waitFor();
  console.log("PASS: browser renders all 20 static medication cards");

  const query = page.getByPlaceholder("약 이름 또는 증상으로 검색...");
  await query.fill("지르텍");
  await page.getByText("총 1개의 약물 정보").waitFor();
  await page.getByRole("heading", { name: "지르텍정" }).waitFor();
  console.log("PASS: medication name search filters cards");

  await query.fill("");
  await page.getByRole("button", { name: "진통제", exact: true }).click();
  await page.getByText("총 2개의 약물 정보").waitFor();
  console.log("PASS: category selection filters cards");

  await page.getByRole("link", { name: "AI 챗봇 상담" }).click();
  await page.waitForURL(base + "/");
  await page.getByRole("button", { name: "로그인", exact: true }).click();
  await page.getByPlaceholder("hong / kim / lee").fill("hong");
  await page.getByPlaceholder("password123").fill("password123");
  await page.getByRole("dialog").getByRole("button", { name: "로그인", exact: true }).click();
  await page.getByText(/홍길동님/).first().waitFor();
  console.log("PASS: test-user login updates the chatbot header");

  const modalStayedOpen = await page.getByRole("dialog").isVisible();
  console.log(modalStayedOpen
    ? "KNOWN LIMITATION: login modal remains open after a successful login"
    : "PASS: login modal closed automatically");
  if (modalStayedOpen) await page.keyboard.press("Escape");

  const input = page.getByPlaceholder(/증상을 알려주세요/);
  await input.fill("안녕하세요");
  await page.getByRole("button", { name: "보내기" }).click();
  await page.getByText("안녕하세요", { exact: true }).waitFor();
  // The login greeting includes the username, while the API greeting does not.
  // Verify actual user-visible reply, separately recording whitespace loss.
  const expectedReply = "안녕하세요! 약장수 챗봇입니다. 어떤 증상으로 불편하신가요?";
  await page.waitForFunction((expected) =>
    [...document.querySelectorAll("div")].some((x) =>
      x.textContent?.trim().replace(/\s+/g, "") === expected.replace(/\s+/g, "")
    ), expectedReply
  );
  const whitespacePreserved = await page.evaluate((expected) =>
    [...document.querySelectorAll("div")].some((x) => x.textContent?.trim() === expected),
    expectedReply
  );
  console.log("PASS: browser submits and renders chatbot reply");
  if (!whitespacePreserved) console.log("KNOWN LIMITATION: SSE client strips some whitespace from the rendered reply");

  assert.equal(browserErrors.length, 0, "Browser uncaught errors: " + browserErrors.join("; "));
  console.log("RESULT: Browser UI flow passed with known limitation(s) listed above");
} catch (error) {
  console.error("BROWSER SMOKE FAILED:", error?.stack ?? error);
  console.error("SERVER LOG TAIL:", log);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  stopServer();
}
