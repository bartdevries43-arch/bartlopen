import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(here, '..', 'assets', 'social');
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const page = await browser.newPage({ viewport: { width: 1200, height: 1500 }, deviceScaleFactor: 1 });
await page.goto(`file://${path.join(here, 'ademhaling-carousel.html')}`, { waitUntil: 'networkidle' });
const slides = page.locator('.slide');
for (let i = 0; i < await slides.count(); i++) {
  await slides.nth(i).screenshot({ path: path.join(out, `ademhaling-pro-${String(i + 1).padStart(2, '0')}.png`), type: 'png' });
}
await browser.close();
console.log('Ademhaling PRO-carousel gerenderd');
