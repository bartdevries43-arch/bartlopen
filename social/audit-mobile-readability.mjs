let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  ({ chromium } = await import('/Users/bartdevries/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs'));
}
import fsSync from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const files = fsSync.readdirSync(here).filter(name => name.endsWith('-carousel.html')).sort();
const localChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch(fsSync.existsSync(localChrome) ? { headless: true, executablePath: localChrome } : { headless: true });
let failures = 0;

for (const file of files) {
  const page = await browser.newPage({ viewport: { width: 1200, height: 1500 }, deviceScaleFactor: 1 });
  await page.goto(`file://${path.join(here, file)}`, { waitUntil: 'networkidle' });
  const report = await page.evaluate(() => {
    const slides = [...document.querySelectorAll('.slide')];
    const small = [];
    const outside = [];
    const clipped = [];
    for (const [slideIndex, slide] of slides.entries()) {
      const slideRect = slide.getBoundingClientRect();
      const nodes = [...slide.querySelectorAll('*')].filter(el => {
        const own = [...el.childNodes].some(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
        const style = getComputedStyle(el);
        return own && style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) !== 0;
      });
      for (const el of nodes) {
        const text = el.textContent.replace(/\s+/g, ' ').trim();
        const size = parseFloat(getComputedStyle(el).fontSize);
        const tag = el.tagName.toLowerCase();
        const secondary = tag === 'small' || el.matches('.eyebrow,.counter,.brand,.brand *');
        const minimum = secondary ? 18 : 22;
        if (size < minimum) small.push({ slide: slideIndex + 1, size, text: text.slice(0, 70) });
        const rect = el.getBoundingClientRect();
        if (rect.left < slideRect.left - 1 || rect.right > slideRect.right + 1 || rect.top < slideRect.top - 1 || rect.bottom > slideRect.bottom + 1) {
          outside.push({ slide: slideIndex + 1, text: text.slice(0, 70) });
        }
      }
      const clippingNodes = [...slide.querySelectorAll('*')].filter(el => {
        const style = getComputedStyle(el);
        const own = [...el.childNodes].some(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
        return own && (['hidden', 'clip'].includes(style.overflow) || ['hidden', 'clip'].includes(style.overflowX) || ['hidden', 'clip'].includes(style.overflowY));
      });
      for (const el of clippingNodes) {
        if (el.scrollHeight > el.clientHeight + 2 || el.scrollWidth > el.clientWidth + 2) {
          clipped.push({
            slide: slideIndex + 1,
            selector: el.className || el.tagName.toLowerCase(),
            overflow: `${el.scrollWidth}x${el.scrollHeight} binnen ${el.clientWidth}x${el.clientHeight}`
          });
        }
      }
    }
    return { small, outside, clipped };
  });
  if (report.small.length || report.outside.length || report.clipped.length) {
    failures += 1;
    console.log(`\n${file}`);
    if (report.small.length) console.log('  Te klein:', report.small.slice(0, 12));
    if (report.outside.length) console.log('  Buiten beeld:', report.outside.slice(0, 12));
    if (report.clipped.length) console.log('  Afgekapt:', report.clipped.slice(0, 12));
  } else {
    console.log(`${file}: goed`);
  }
  await page.close();
}

await browser.close();
console.log(`\nControle afgerond. Series met aandachtspunten: ${failures} van ${files.length}.`);
if (failures) process.exitCode = 1;
