/**
 * Drive the app end-to-end and capture the RFQ & Quotation demo flow.
 * Usage: node scripts/demo-record.mjs
 * Requires the dev server on http://localhost:3000 and the seeded owner account.
 */
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';

const BASE = 'http://localhost:3000';
const OUT = '/tmp/claude-1000/-home-kamrul-hasan-Projects-fabricXai-fabricXai-the-garments-intelligent-platform/cbd421db-5d2c-4005-8c65-d33ad96fe042/scratchpad/demo';
mkdirSync(OUT, { recursive: true });

const EMAIL = 'kamrul.sociofi@gmail.com';
const PASSWORD = 'K381654729@mk';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/google-chrome-stable',
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu', '--window-size=1440,900'],
  defaultViewport: { width: 1440, height: 900 },
});
const page = await browser.newPage();
const shots = [];
async function shot(name, label) {
  const file = `${OUT}/${name}.png`;
  await page.screenshot({ path: file });
  shots.push({ file, label });
  console.log('shot:', name, '-', label);
}
async function go(path) {
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle2', timeout: 45000 }).catch(() => {});
  await sleep(1500);
}

try {
  // 1. Login page
  await go('/login');
  await shot('01-login', 'Sign in — brand login screen');

  // 2. Authenticate
  await page.type('#email', EMAIL, { delay: 15 });
  await page.type('#password', PASSWORD, { delay: 15 });
  await Promise.all([
    page.waitForFunction(() => location.pathname.includes('/dashboard'), { timeout: 30000 }).catch(() => {}),
    page.click('button[type="submit"]'),
  ]);
  await sleep(2500);
  await shot('02-dashboard', 'Role dashboard after sign-in');

  // 3. RFQ dashboard
  await go('/rfq-quotation');
  await shot('03-rfq-dashboard', 'RFQ & Quotation — real pipeline (status KPIs, recent RFQs)');

  // 4. RFQ inbox
  await go('/rfq-quotation/rfq-inbox');
  await shot('04-rfq-inbox', 'RFQ Inbox — real RFQs, status filters');

  // 4b. Open an RFQ detail drawer
  try {
    await page.click('tbody tr');
    await sleep(1800);
    await shot('05-rfq-detail', 'RFQ detail — buyer request opened');
    await page.keyboard.press('Escape').catch(() => {});
    await sleep(800);
  } catch (e) { console.log('rfq row click skipped:', e.message); }

  // 5. Quotation builder
  await go('/rfq-quotation/quotation-builder');
  await shot('06-quotation-builder', 'Quotation Builder — real quotes, FOB engine');

  // 5b. Quote slide-over
  try {
    await page.click('tbody tr');
    await sleep(1500);
    await shot('07-quote-detail', 'Quote detail — cost breakdown & computed FOB');
    await page.keyboard.press('Escape').catch(() => {});
    await sleep(800);
  } catch (e) { console.log('quote row click skipped:', e.message); }

  // 6. Clarification tracker
  await go('/rfq-quotation/clarification-tracker');
  await shot('08-clarification-tracker', 'Clarification Tracker — real questions & answers');

  // 7. Approve inbox
  await go('/approve');
  await shot('09-approve', 'Approve inbox — where MARBIM drafts land');

  console.log('DONE', shots.length, 'shots');
  console.log(JSON.stringify(shots.map((s) => s.file)));
} catch (e) {
  console.error('FLOW ERROR:', e.message);
} finally {
  await browser.close();
}
