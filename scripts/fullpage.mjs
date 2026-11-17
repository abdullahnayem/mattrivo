// Scrolls the page to trigger in-view animations, then captures a full-page screenshot.
// Usage: node scripts/fullpage.mjs <url> <out.png> [width] [height] [dpr]
import { chromium } from "playwright-core";
const [url, out, w = "1440", h = "900", dpr = "1"] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: +dpr });
const errors = [];
page.on("console", (m) => (m.type() === "error" || m.type() === "warning") && errors.push(`[${m.type()}] ${m.text().slice(0, 300)}`));
page.on("pageerror", (e) => errors.push("[pageerror] " + String(e).slice(0, 300)));
page.on("requestfailed", (r) => errors.push("[requestfailed] " + r.url()));
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
const total = await page.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < total; y += Math.floor(+h * 0.6)) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(260);
}
await page.waitForTimeout(2200);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(600);
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
await page.screenshot({ path: out, fullPage: true });
console.log("height", total, "horizontal overflow", overflow);
if (errors.length) console.log("CONSOLE:\n" + [...new Set(errors)].join("\n"));
await browser.close();
