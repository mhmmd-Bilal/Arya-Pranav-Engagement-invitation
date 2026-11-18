// npm run qa  (with `npm run preview` running on :4173)
// Drives a local Chrome/Edge through the site: console errors, broken images,
// horizontal overflow at every target width, opening + session memory,
// pinned story, menu, countdown, lightbox, RSVP, reduced motion.
// Screenshots land in qa-shots/.
import { existsSync, mkdirSync } from 'node:fs';
import puppeteer from 'puppeteer-core';

const URL = process.env.QA_URL || 'http://localhost:4173/';
const WIDTHS = [320, 360, 375, 390, 414, 430, 768, 1024, 1280, 1440, 1920];
const SHOT_WIDTHS = [390, 1440];
const SECTIONS = ['top', 'invitation', 'couple', 'story', 'events', 'venue', 'gallery', 'rsvp'];
const browserPath = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].find((p) => p && existsSync(p));

mkdirSync('qa-shots', { recursive: true });
const browser = await puppeteer.launch({ executablePath: browserPath, headless: true });
const failures = [];
const fail = (msg) => {
  failures.push(msg);
  console.log('  ✖', msg);
};
const pause = (ms) => new Promise((r) => setTimeout(r, ms));
const ENTER = '::-p-text(Enter the celebration)';

async function openPage(width, { reduced = false } = {}) {
  const page = await browser.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('requestfailed', (r) => !/google|gstatic/.test(r.url()) && errors.push(`request failed: ${r.url()}`));
  const mobile = width < 768;
  await page.setViewport({ width, height: mobile ? 800 : 900, isMobile: mobile, hasTouch: mobile });
  if (reduced) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto(URL, { waitUntil: 'networkidle0' });
  return { page, errors };
}

async function enter(page) {
  await page.waitForSelector(ENTER, { visible: true, timeout: 8000 });
  await pause(2600); // let the opening finish its entrance before clicking
  await page.click(ENTER);
  await pause(3200);
}

const jump = (page, y) => page.evaluate((v) => window.scrollTo(0, v), y);

async function scrollThrough(page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 450) {
    await jump(page, y);
    await pause(90);
  }
  await pause(1200);
}

const overflow = (page) =>
  page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const wide = [...document.querySelectorAll('body *')].filter((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || getComputedStyle(el).position === 'fixed') return false;
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        const o = getComputedStyle(p).overflowX;
        if (o === 'hidden' || o === 'clip') return false;
      }
      return r.right > vw + 1 || r.left < -1;
    });
    return { scroll: document.documentElement.scrollWidth - vw, culprits: wide.slice(0, 3).map((e) => e.outerHTML.slice(0, 140)) };
  });

for (const width of WIDTHS) {
  console.log(`\n${width}px`);
  const { page, errors } = await openPage(width);
  const shots = SHOT_WIDTHS.includes(width);
  if (shots) {
    await pause(3400);
    await page.screenshot({ path: `qa-shots/${width}-01-opening.png` });
  }
  await enter(page);
  if (await page.$('[aria-label="Wedding invitation opening"]')) fail(`${width}: opening did not close`);
  const btn = await page.$eval('a[href*="wa.me"]', (a) => a.getBoundingClientRect().right);
  if (btn > width) fail(`${width}: promo button runs off screen`);

  await scrollThrough(page);
  const o = await overflow(page);
  if (o.scroll > 0 || o.culprits.length) fail(`${width}: horizontal overflow ${o.scroll}px ${o.culprits.join(' | ')}`);

  const pinned = await page.$('.pin-spacer');
  if (width >= 1024 && !pinned) fail(`${width}: story is not pinned on desktop`);
  if (width < 1024 && pinned) fail(`${width}: story pinned on a small screen`);

  if (shots) {
    for (const [n, id] of SECTIONS.entries()) {
      const y = await page.evaluate((s) => (s === 'top' ? 0 : document.getElementById(s).getBoundingClientRect().top + window.scrollY), id);
      await jump(page, y + (id === 'story' ? 200 : 0));
      await pause(1800);
      await page.screenshot({ path: `qa-shots/${width}-${String(n + 2).padStart(2, '0')}-${id}.png` });
    }
    // countdown + closing
    for (const [name, sel] of [['countdown', '[aria-label="Countdown to the wedding"]'], ['final', 'footer']]) {
      const y = await page.evaluate((s) => document.querySelector(s).getBoundingClientRect().top + window.scrollY, sel);
      await jump(page, y + (name === 'final' ? 300 : 0));
      await pause(1800);
      await page.screenshot({ path: `qa-shots/${width}-${name}.png` });
    }
  }

  const broken = await page.evaluate(() =>
    [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.loading !== 'lazy').map((i) => i.currentSrc || i.src),
  );
  if (broken.length) fail(`${width}: broken images ${broken.join(', ')}`);
  if (await page.$('[role="img"].bg-linen')) fail(`${width}: an image fell back to its placeholder`);
  if (errors.length) fail(`${width}: console errors ${errors.join(' | ')}`);
  await page.close();
}

console.log('\nopening: skip + session memory');
{
  const { page, errors } = await openPage(1440);
  await page.click('::-p-text(Skip intro)');
  await pause(1200);
  if (await page.$('[aria-label="Wedding invitation opening"]')) fail('skip did not close the opening');
  await page.reload({ waitUntil: 'networkidle0' });
  await pause(800);
  if (await page.$('[aria-label="Wedding invitation opening"]')) fail('opening replayed in the same session');
  await page.screenshot({ path: 'qa-shots/1440-after-reload.png' });
  if (errors.length) fail(`session: console errors ${errors.join(' | ')}`);
  await page.close();
}

console.log('\ninteractions @390px');
{
  const { page, errors } = await openPage(390);
  await enter(page);

  const promo = await page.$eval('a[href*="wa.me"]', (a) => ({ href: a.href, text: a.innerText.trim(), target: a.target }));
  if (!promo.href.startsWith('https://wa.me/918129896670') || promo.target !== '_blank') fail(`promo link wrong: ${JSON.stringify(promo)}`);
  else console.log('  promo →', promo.text, promo.href.slice(0, 40));
  await page.screenshot({ path: 'qa-shots/390-nav-promo.png' });

  const sel = '[data-countdown-text]';
  const label = await page.$eval(sel, (e) => e.textContent);
  const expected = await page.evaluate(() => Math.floor((Date.parse('2027-02-12T19:30:00+05:30') - Date.now()) / 86400000));
  if (!label.startsWith(`${expected} days`)) fail(`countdown says "${label}", expected ${expected} days`);

  await page.evaluate(() => document.getElementById('gallery').scrollIntoView());
  await pause(1800);
  await page.click('#gallery figure button');
  await pause(1000);
  const counter = () => page.$eval('[data-lightbox] [aria-live]', (e) => e.textContent.trim());
  if ((await counter()) !== '01 / 10') fail(`lightbox counter ${await counter()}`);
  await page.click('[aria-label="Next photo"]');
  await pause(900);
  if ((await counter()) !== '02 / 10') fail(`next photo → ${await counter()}`);
  await page.keyboard.press('ArrowLeft');
  await pause(900);
  await page.keyboard.press('ArrowLeft');
  await pause(900);
  if ((await counter()) !== '10 / 10') fail(`wrap-around previous → ${await counter()}`);
  await page.screenshot({ path: 'qa-shots/390-lightbox.png' });
  await page.keyboard.press('Escape');
  await pause(900);
  if (await page.$('[data-lightbox]')) fail('Escape did not close lightbox');
  if ((await page.evaluate(() => document.documentElement.style.overflow)) !== '') fail('scroll still locked after lightbox');

  await page.evaluate(() => document.getElementById('rsvp').scrollIntoView());
  await pause(1500);
  await page.click('#rsvp button[type="submit"]');
  await pause(500);
  const invalid = await page.$$eval('#rsvp [aria-invalid="true"]', (els) => els.length);
  if (invalid < 3) fail(`empty RSVP flagged ${invalid} fields, expected ≥3`);
  if ((await page.evaluate(() => document.activeElement?.getAttribute('autocomplete'))) !== 'name') fail('first invalid field not focused');
  await page.screenshot({ path: 'qa-shots/390-rsvp-errors.png' });

  await page.type('#rsvp input[autocomplete="name"]', 'Riya Kapoor');
  await page.type('#rsvp input[autocomplete="email"]', 'riya@example.com');
  await page.click('#rsvp input[value="yes"]');
  await pause(600);
  await page.click('#rsvp button[type="submit"]');
  await pause(1000);
  const alert = await page.$eval('#rsvp [role="alert"]', (e) => e.textContent).catch(() => null);
  if (!alert) fail('RSVP without endpoint showed no error');
  else console.log('  RSVP (no endpoint) →', alert.trim());
  await page.screenshot({ path: 'qa-shots/390-rsvp-state.png' });

  await page.evaluate(() => document.getElementById('venue').scrollIntoView());
  await pause(800);
  await page.click('button[aria-controls="venue-map"]');
  await pause(1500);
  if (!(await page.$('#venue-map iframe'))) fail('View map did not open the map');

  const links = await page.$$eval('#venue a, #events a', (as) => as.map((a) => a.href));
  if (!links.length || !links.every((h) => h.startsWith('https://www.google.com/maps'))) fail(`unexpected map links ${links}`);

  if (errors.length) fail(`interactions: console errors ${errors.join(' | ')}`);
  await page.close();
}

console.log('\nreduced motion @1440px');
{
  const { page, errors } = await openPage(1440, { reduced: true });
  await enter(page);
  if (await page.$('.pin-spacer')) fail('story pinned despite reduced motion');
  const storyVisible = await page.$eval('#story ol', (e) => getComputedStyle(e).display !== 'none');
  if (!storyVisible) fail('stacked story hidden under reduced motion');
  const animated = await page.$$eval('.sway, .scroll-cue', (els) => els.filter((e) => getComputedStyle(e).animationName !== 'none').length);
  if (animated) fail(`${animated} CSS animations still running with reduced motion`);
  await page.evaluate(() => document.getElementById('story').scrollIntoView());
  await pause(1500);
  await page.screenshot({ path: 'qa-shots/1440-reduced-story.png' });
  if (errors.length) fail(`reduced: console errors ${errors.join(' | ')}`);
  await page.close();
}

await browser.close();
console.log(failures.length ? `\n${failures.length} problem(s)` : '\nAll checks passed');
process.exit(failures.length ? 1 : 0);
