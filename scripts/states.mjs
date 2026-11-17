// Captures interactive states for visual QA. Usage: node scripts/states.mjs <base> <outDir>
import { chromium } from "playwright-core";
const [base, out] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(base, { waitUntil: "networkidle" });
await p.waitForTimeout(2500);
await p.getByRole("button", { name: "Mattresses", exact: true }).hover();
await p.waitForTimeout(1200);
await p.screenshot({ path: `${out}/st-mega.png` });
await p.mouse.move(700, 800);
await p.locator("#bestsellers").scrollIntoViewIfNeeded();
await p.waitForTimeout(1500);
await p.locator("#bestsellers article").nth(1).hover();
await p.waitForTimeout(1500);
await p.screenshot({ path: `${out}/st-cards.png` });
await p.locator("#bestsellers article").nth(1).getByRole("button", { name: "Quick view" }).click();
await p.waitForTimeout(1400);
await p.screenshot({ path: `${out}/st-quick.png` });
await p.getByRole("dialog").getByRole("button", { name: /Add to basket/ }).click();
await p.waitForTimeout(1400);
await p.screenshot({ path: `${out}/st-cart.png` });
await p.keyboard.press("Escape");
await p.waitForTimeout(800);
await p.locator("#finder").scrollIntoViewIfNeeded();
for (const l of ["Just me", "Back", "Medium-firm", "Yes, often", "No", "Even support", "Double", "Flexible"]) {
  await p.locator("#finder fieldset label").filter({ hasText: l }).first().click();
  await p.waitForTimeout(800);
}
await p.waitForTimeout(1200);
await p.evaluate(() => window.scrollTo(0, document.getElementById("finder").getBoundingClientRect().top + window.scrollY + 60));
await p.waitForTimeout(800);
await p.screenshot({ path: `${out}/st-finder.png` });
await p.goto(base + "/mattresses/premium-pillowtop", { waitUntil: "networkidle" });
await p.waitForTimeout(1500);
await p.screenshot({ path: `${out}/st-pdp.png` });
await b.close();
