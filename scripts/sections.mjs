// Viewport screenshots of named sections. Usage: node scripts/sections.mjs <url> <outPrefix> <w> <h> <id,id,...> [offset]
import { chromium } from "playwright-core";
const [url, prefix, w, h, ids, offset = "0"] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const p = await b.newPage({ viewport: { width: +w, height: +h } });
const errors = [];
p.on("pageerror", (e) => errors.push(String(e)));
p.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 200)));
await p.goto(url, { waitUntil: "networkidle" });
for (const id of ids.split(",")) {
  await p.evaluate(([id, off]) => { const el = document.getElementById(id); window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + Number(off)); }, [id, offset]);
  await p.waitForTimeout(2200);
  await p.screenshot({ path: `${prefix}-${id}.png` });
}
if (errors.length) console.log(errors.join("\n"));
await b.close();
