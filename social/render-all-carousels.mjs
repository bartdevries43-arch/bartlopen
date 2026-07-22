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

const decks = [
  ['ademhaling', 'ademhaling-pro'],
  ['cadans', 'cadans-pro'],
  ['cafeine', 'cafeine-pro'],
  ['carbload', 'carbload-pro'],
  ['creatine', 'creatine-pro'],
  ['easy', 'easy-pro'],
  ['falen', 'falen-pro'],
  ['fullbody-split', 'fullbody-split-pro'],
  ['fullbody3', 'fullbody3-pro'],
  ['gels', 'gels-pro'],
  ['hitte', 'hitte-pro'],
  ['hybrid', 'hybrid-hardlopen-kracht-pro'],
  ['intervaltempo', 'intervaltempo-pro'],
  ['kuittraining', 'kuittraining-pro'],
  ['legday', 'legday-pro'],
  ['marathonmuur', 'marathonmuur-pro'],
  ['missed', 'missed-pro'],
  ['ochtendrun', 'ochtendrun-pro'],
  ['pacing', 'pacing-pro'],
  ['recovery', 'recovery-pro'],
  ['spierpijn', 'spierpijn-pro'],
  ['strides', 'strides-pro'],
  ['sub20', 'sub20-5k-pro'],
  ['sub40', 'sub40-10k-pro'],
  ['taper', 'taper-pro'],
  ['threedays', 'threedays-pro'],
  ['tienprocent', 'tienprocent-pro'],
  ['vo2max', 'vo2max-pro'],
  ['watchcheck', 'watchcheck-pro'],
  ['zone2', 'zone2-pro']
];

const localChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch(fsSync.existsSync(localChrome)
  ? { headless: true, executablePath: localChrome }
  : { headless: true });

for (const [slug, prefix] of decks) {
  const page = await browser.newPage({ viewport: { width: 1200, height: 1500 }, deviceScaleFactor: 1 });
  await page.goto(`file://${path.join(here, `${slug}-carousel.html`)}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const slides = page.locator('.slide');
  const count = await slides.count();
  if (count !== 8) throw new Error(`${slug} heeft ${count} slides in plaats van 8`);
  for (let i = 0; i < count; i += 1) {
    await slides.nth(i).screenshot({
      path: path.join(out, `${prefix}-${String(i + 1).padStart(2, '0')}.png`),
      type: 'png'
    });
  }
  await page.close();
  console.log(`${slug}: 8 slides opnieuw gerenderd`);
}

await browser.close();
console.log(`Klaar: ${decks.length * 8} mobiele slides opnieuw gerenderd.`);
