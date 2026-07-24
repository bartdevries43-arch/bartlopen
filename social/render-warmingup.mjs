let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  ({ chromium } = await import('/Users/bartdevries/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs'));
}
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(here, '..', 'assets', 'social');
await fs.mkdir(out, { recursive: true });
const localChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch(fsSync.existsSync(localChrome) ? { headless: true, executablePath: localChrome } : { headless: true });
const page = await browser.newPage({ viewport: { width: 1200, height: 1500 }, deviceScaleFactor: 1 });
await page.goto(`file://${path.join(here, 'warmingup-carousel.html')}`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const slides = page.locator('.slide');
if (await slides.count() !== 8) throw new Error('Warming-upcarousel moet 8 slides hebben');
for (let i = 0; i < 8; i += 1) {
  await slides.nth(i).screenshot({
    path: path.join(out, `warmingup-pro-${String(i + 1).padStart(2, '0')}.png`),
    type: 'png'
  });
}
await browser.close();
console.log('Warming-up PRO-carousel gerenderd');
