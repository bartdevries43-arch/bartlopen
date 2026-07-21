let chromium;
try { ({ chromium } = await import('playwright')); }
catch { ({ chromium } = await import('/Users/bartdevries/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs')); }
import fsSync from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch(fsSync.existsSync(chrome) ? { headless:true, executablePath:chrome } : { headless:true });
for (const type of ['covers','dense']) {
  const page = await browser.newPage({ viewport:{ width:1440, height:1000 }, deviceScaleFactor:1 });
  const query = type === 'dense' ? '?type=dense' : '';
  await page.goto(`file://${path.join(here,'qa-contact-sheet.html')}${query}`, { waitUntil:'networkidle' });
  await page.screenshot({ path:`/tmp/bartlopen-${type}-qa.png`, fullPage:true, type:'png' });
  await page.close();
}
await browser.close();
console.log('QA-overzichten gemaakt');
