import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const social = path.dirname(fileURLToPath(import.meta.url));
const root = path.dirname(social);
const assets = path.join(root, 'assets', 'social');
const downloads = path.join(root, 'downloads');
await fs.mkdir(downloads, { recursive: true });

const decks = [
  ['ademhaling-pro','ademhaling','bartlopen-ademhaling-carousel.zip'],
  ['cadans-pro','cadans','bartlopen-cadans-carousel.zip'],
  ['cafeine-pro','cafeine','bartlopen-cafeine-carousel.zip'],
  ['carbload-pro','carbload','bartlopen-carbload-carousel.zip'],
  ['creatine-pro','creatine','bartlopen-creatine-carousel.zip'],
  ['easy-pro','easy','bartlopen-easy-carousel.zip'],
  ['falen-pro','falen','bartlopen-falen-carousel.zip'],
  ['fullbody-split-pro','fullbody-split','bartlopen-fullbody-split-carousel.zip'],
  ['fullbody3-pro','fullbody3','bartlopen-fullbody3-carousel.zip'],
  ['gels-pro','gels','bartlopen-gels-carousel.zip'],
  ['hitte-pro','hitte','bartlopen-hitte-carousel.zip'],
  ['hybrid-hardlopen-kracht-pro','hardlopen-kracht','bartlopen-carousel-hardlopen-kracht.zip'],
  ['intervaltempo-pro','intervaltempo','bartlopen-intervaltempo-carousel.zip'],
  ['kuittraining-pro','kuittraining','bartlopen-kuittraining-carousel.zip'],
  ['legday-pro','legday','bartlopen-legday-carousel.zip'],
  ['marathonmuur-pro','marathonmuur','bartlopen-marathonmuur-carousel.zip'],
  ['missed-pro','missed','bartlopen-missed-carousel.zip'],
  ['ochtendrun-pro','ochtendrun','bartlopen-ochtendrun-carousel.zip'],
  ['pacing-pro','pacing','bartlopen-pacing-carousel.zip'],
  ['recovery-pro','recovery','bartlopen-recovery-carousel.zip'],
  ['spierpijn-pro','spierpijn','bartlopen-spierpijn-carousel.zip'],
  ['strides-pro','strides','bartlopen-strides-carousel.zip'],
  ['sub20-5k-pro','sub20','bartlopen-sub20-5k-carousel.zip'],
  ['sub40-10k-pro','sub40','bartlopen-sub40-10k-carousel.zip'],
  ['taper-pro','taper','bartlopen-taper-carousel.zip'],
  ['threedays-pro','threedays','bartlopen-threedays-carousel.zip'],
  ['tienprocent-pro','tienprocent','bartlopen-tienprocent-carousel.zip'],
  ['vo2max-pro','vo2max','bartlopen-vo2max-carousel.zip'],
  ['warmingup-pro','warmingup','bartlopen-warmingup-carousel.zip'],
  ['watchcheck-pro','watchcheck','bartlopen-watchcheck-carousel.zip'],
  ['zone2-pro','zone2','bartlopen-zone2-carousel.zip']
];

for (const [prefix, caption, zipName] of decks) {
  const output = path.join(downloads, zipName);
  const files = Array.from({ length: 8 }, (_, index) => path.join(assets, `${prefix}-${String(index + 1).padStart(2, '0')}.png`));
  files.push(path.join(social, `caption-${caption}.txt`));
  await fs.rm(output, { force: true });
  const result = spawnSync('zip', ['-j', '-q', output, ...files], { stdio: 'inherit' });
  if (result.status !== 0) throw new Error(`ZIP maken mislukt: ${zipName}`);
  console.log(`${zipName}: vernieuwd`);
}

for (const duplicate of ['bartlopen-kuittraining-carousel.zip', 'bartlopen-strides-carousel.zip']) {
  await fs.copyFile(path.join(downloads, duplicate), path.join(root, 'zip_carousel_downloads', duplicate));
}

console.log(`Klaar: ${decks.length} downloadpakketten vernieuwd.`);
