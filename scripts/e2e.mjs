// End-to-end interaction check against a running server.
// Usage: node scripts/e2e.mjs [baseUrl]
import { chromium } from "playwright-core";

const base = process.argv[2] ?? "http://localhost:3100";
const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const results = [];
const errors = [];

async function check(name, fn) {
  try {
    await fn();
    results.push(`PASS  ${name}`);
  } catch (e) {
    results.push(`FAIL  ${name}\n      ${String(e.message ?? e).split("\n")[0]}`);
  }
}
const expect = (cond, msg) => {
  if (!cond) throw new Error(msg);
};

async function newPage(viewport = { width: 1440, height: 900 }) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(`[pageerror] ${e}`));
  page.on("console", (m) => m.type() === "error" && !m.text().includes("404") && errors.push(`[console] ${m.text().slice(0, 200)}`));
  page.on("response", (r) => r.status() >= 400 && !r.url().includes("does-not-exist") && errors.push(`[http ${r.status()}] ${r.url()}`));
  return page;
}

/* ---------------- Desktop ---------------- */
const page = await newPage();
await page.goto(base, { waitUntil: "networkidle" });

await check("Mega menu opens on hover", async () => {
  await page.getByRole("button", { name: "Mattresses", exact: true }).hover();
  await page.locator("header").getByText("Four considered designs").waitFor({ timeout: 3000 });
  await page.mouse.move(700, 600);
  await page.waitForTimeout(500);
});

await check("Search finds products", async () => {
  await page.getByRole("button", { name: "Search" }).click();
  await page.locator("#site-search").fill("pillowtop");
  await page.getByRole("dialog", { name: "Search" }).getByRole("link", { name: /Premium Pillowtop/ }).first().waitFor({ timeout: 3000 });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(600);
});

await check("Add to basket from product card updates count", async () => {
  await page.locator("#bestsellers").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Add Essential, Double, to basket" }).click();
  await page.getByRole("button", { name: "Shopping bag, 1 items" }).waitFor({ timeout: 3000 });
});

await check("Basket drawer: quantity and subtotal", async () => {
  await page.getByRole("button", { name: "Shopping bag, 1 items" }).click();
  const drawer = page.getByRole("dialog", { name: "Your basket" });
  await drawer.waitFor();
  await drawer.getByRole("button", { name: "Increase quantity" }).click();
  await drawer.getByText("£358").first().waitFor({ timeout: 3000 });
  await drawer.getByRole("button", { name: "Continue to checkout" }).click();
  await page.getByRole("dialog", { name: "Checkout" }).getByText("No payment is taken").waitFor({ timeout: 3000 });
  await page.getByRole("button", { name: "Understood" }).click();
  await page.waitForTimeout(700);
});

await check("Wishlist toggle and drawer", async () => {
  await page.getByRole("button", { name: "Save Comfort Hybrid to wishlist" }).click();
  await page.getByRole("button", { name: "Wishlist, 1 items" }).click();
  await page.getByRole("dialog", { name: "Wishlist" }).getByText("Comfort Hybrid").waitFor({ timeout: 3000 });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(700);
});

await check("Compare two mattresses", async () => {
  const boxes = page.locator("#bestsellers").getByRole("checkbox");
  await boxes.nth(0).check();
  await boxes.nth(1).check();
  await page.getByRole("button", { name: "Compare 2" }).click();
  const modal = page.getByRole("dialog", { name: "Side by side" });
  await modal.waitFor();
  const cols = await modal.locator("thead th").count();
  expect(cols === 3, `expected 3 header cells, got ${cols}`);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);
  await page.locator("[aria-label='Mattress comparison']").getByRole("button", { name: "Clear" }).click();
});

await check("Quick view: choose King and add", async () => {
  await page.locator("#bestsellers article").nth(2).hover();
  await page.locator("#bestsellers article").nth(2).getByRole("button", { name: "Quick view" }).click();
  const dlg = page.getByRole("dialog", { name: "Premium Pillowtop" });
  await dlg.waitFor();
  await dlg.getByText("King", { exact: true }).click();
  await dlg.getByRole("button", { name: /Add to basket · £469/ }).click();
  await page.getByRole("dialog", { name: "Your basket" }).getByText("King · 150 × 200 cm").waitFor({ timeout: 3000 });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(600);
});

await check("Collection tile filters the grid", async () => {
  await page.locator("#collections").getByRole("link", { name: /Natural Comfort/ }).click();
  await page.waitForTimeout(1200);
  const n = await page.locator("#bestsellers article").count();
  expect(n === 1, `expected 1 product after Natural filter, got ${n}`);
  await page.locator("#bestsellers").getByRole("tab", { name: "All" }).click();
  await page.waitForTimeout(900);
});

await check("Mattress Finder completes with explained results", async () => {
  await page.locator("#finder").scrollIntoViewIfNeeded();
  const picks = ["Me and a partner", "Side", "Medium", "Sometimes", "Yes, with a partner", "Pressure relief", "King", "£250 – £450"];
  for (const label of picks) {
    await page.locator("#finder fieldset label").filter({ hasText: label }).first().click();
    await page.waitForTimeout(800);
  }
  await page.getByText("Our closest match").waitFor({ timeout: 4000 });
  const text = await page.locator("#finder").innerText();
  expect(!/\d+\s?%/.test(text), "results contain a percentage");
  const reasons = await page.locator("#finder li ul li").count();
  expect(reasons > 0, "no reasons listed");
  results.push(`      first match: ${(await page.locator("#finder ol li p.font-serif").first().innerText()).trim()}`);
});

await check("Construction: next layer and reset", async () => {
  await page.locator("#construction").scrollIntoViewIfNeeded();
  await page.waitForTimeout(2600);
  await page.getByRole("button", { name: "Next layer" }).click();
  await page.locator("#construction h3", { hasText: "Quilted Comfort Layer" }).waitFor({ timeout: 3000 });
  await page.getByRole("button", { name: "Reset view" }).click();
  await page.locator("#construction h3", { hasText: "Six layers" }).waitFor({ timeout: 3000 });
});

await check("Sleeping style presets the finder", async () => {
  await page.locator("#sleeping-styles").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Find mattresses for side sleepers" }).click();
  await page.waitForTimeout(1500);
  await page.locator("#finder").getByText(/Question 0\d of 08|Your results/).first().waitFor({ timeout: 3000 });
  const recap = await page.locator("#finder ol").first().innerText();
  expect(recap.includes("Side"), "position not preset to Side");
});

await check("FAQ accordion expands", async () => {
  await page.locator("#faq").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "How long does delivery take?" }).click();
  await page.locator("#faq").getByText("We deliver across the UK").waitFor({ timeout: 3000 });
});

await check("Newsletter validates and confirms", async () => {
  const input = page.locator("#newsletter-email");
  await input.scrollIntoViewIfNeeded();
  await input.fill("not-an-email");
  await page.getByRole("button", { name: "Subscribe" }).click();
  await page.getByText("Please enter a valid email address.").waitFor({ timeout: 2000 });
  await input.fill("sleep@example.co.uk");
  await page.getByRole("button", { name: "Subscribe" }).click();
  await page.getByText("You are on the list").waitFor({ timeout: 2000 });
});

await check("Basket persists across reload", async () => {
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Shopping bag, [1-9]/ }).waitFor({ timeout: 4000 });
});

/* ---------------- Pages ---------------- */
for (const path of ["/mattresses/comfort-hybrid", "/mattresses/natural-comfort", "/journal/uk-mattress-sizes", "/info/privacy-policy"]) {
  await check(`Page ${path} renders`, async () => {
    const p = await newPage();
    const res = await p.goto(base + path, { waitUntil: "networkidle" });
    expect(res.status() === 200, `status ${res.status()}`);
    await p.locator("h1").first().waitFor();
    await p.context().close();
  });
}
await check("Unknown page returns 404", async () => {
  const p = await newPage();
  const res = await p.goto(base + "/mattresses/does-not-exist");
  expect(res.status() === 404, `status ${res.status()}`);
  await p.context().close();
});

/* ---------------- Mobile ---------------- */
await check("Mobile menu opens and navigates", async () => {
  const m = await newPage({ width: 390, height: 844 });
  await m.goto(base, { waitUntil: "networkidle" });
  await m.getByRole("button", { name: "Open menu" }).click();
  const menu = m.getByRole("dialog", { name: "Menu" });
  await menu.waitFor();
  await menu.getByRole("link", { name: "Sleep Journal" }).click();
  await m.waitForTimeout(900);
  expect(!(await menu.isVisible()), "menu still visible after navigating");
  const overflow = await m.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow <= 0, `horizontal overflow ${overflow}px`);
  await m.context().close();
});

for (const width of [375, 768, 1024, 1280]) {
  await check(`No horizontal overflow at ${width}px`, async () => {
    const p = await newPage({ width, height: 900 });
    await p.goto(base, { waitUntil: "networkidle" });
    const overflow = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow <= 0, `overflow ${overflow}px`);
    await p.context().close();
  });
}

await browser.close();
console.log(results.join("\n"));
const uniq = [...new Set(errors)];
console.log(uniq.length ? `\nBrowser errors (${uniq.length}):\n${uniq.join("\n")}` : "\nNo browser errors.");
