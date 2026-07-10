#!/usr/bin/env node
/**
 * Verify V-001 + V-016 on portfolio.html
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.BASE_URL || 'http://localhost:8084';
const OUT = path.join(__dirname, '../docs/reviews/screenshots/p1-visual/portfolio');

const VIEWPORTS = [
  { id: '1440x900', width: 1440, height: 900, mobile: false },
  { id: '768x1024', width: 768, height: 1024, mobile: true },
  { id: '390x844', width: 390, height: 844, mobile: true },
  { id: '360x800', width: 360, height: 800, mobile: true },
];

async function verifyViewport(browser, vp) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    isMobile: vp.mobile,
    hasTouch: vp.mobile,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));

  await page.goto(BASE + '/portfolio.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);

  const layout = await page.evaluate(() => {
    const doc = document.documentElement;
    const offenders = [...document.querySelectorAll('[data-portfolio-video], .portfolio-showcase__content')]
      .filter((el) => el.getBoundingClientRect().width > doc.clientWidth + 1)
      .map((el) => ({
        cls: (el.className || '').toString().slice(0, 50),
        w: Math.round(el.getBoundingClientRect().width),
      }));
    return {
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
      overflow: doc.scrollWidth > doc.clientWidth + 1,
      offenders,
      playButtons: document.querySelectorAll('.portfolio-video-play').length,
      playVisible: [...document.querySelectorAll('.portfolio-video-play')].filter((b) => !b.hidden).length,
    };
  });

  let video = {};
  if (vp.mobile) {
    const bring = page.locator('#bring [data-portfolio-video]');
    await bring.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    video = await page.evaluate(() => {
      const wrap = document.querySelector('#bring [data-portfolio-video]');
      const v = wrap?.querySelector('video');
      const btn = wrap?.querySelector('.portfolio-video-play');
      return {
        btnExists: !!btn,
        btnVisible: btn ? !btn.hidden : false,
        paused: v?.paused,
      };
    });
    if (video.btnVisible) {
      await page.locator('#bring .portfolio-video-play').click();
      await page.waitForTimeout(600);
    }
    video.afterTap = await page.evaluate(() => {
      const v = document.querySelector('#bring [data-portfolio-video] video');
      const btn = document.querySelector('#bring .portfolio-video-play');
      return { paused: v?.paused, btnHidden: btn?.hidden };
    });
  } else if (vp.id === '1440x900') {
    await page.evaluate(() => window.scrollTo(0, document.getElementById('bring')?.offsetTop || 4000));
    await page.waitForTimeout(1200);
    video = await page.evaluate(() => ({
      playing: [...document.querySelectorAll('[data-portfolio-video] video')].filter((v) => !v.paused).length,
      playButtons: document.querySelectorAll('.portfolio-video-play').length,
    }));
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(600);
    video.playingAtTop = await page.evaluate(() =>
      [...document.querySelectorAll('[data-portfolio-video] video')].filter((v) => !v.paused).length
    );
  }

  const dir = path.join(OUT, vp.id);
  await mkdir(dir, { recursive: true });
  await page.screenshot({ path: path.join(dir, 'verify-full.png'), fullPage: false });
  await page.evaluate(() => document.getElementById('bring')?.scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(dir, 'verify-bring.png'), fullPage: false });

  await ctx.close();
  return { viewport: vp.id, layout, video, errors, pass: !layout.overflow && errors.length === 0 };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  for (const vp of VIEWPORTS) {
    results.push(await verifyViewport(browser, vp));
  }
  await browser.close();

  const report = { at: new Date().toISOString(), base: BASE, results };
  await writeFile(path.join(OUT, 'verify-v001-v016.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  const failed = results.filter((r) => !r.pass || (r.viewport.includes('390') || r.viewport.includes('360')) && r.layout.playButtons < 5);
  process.exit(failed.some((r) => !r.pass) ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
