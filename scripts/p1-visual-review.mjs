#!/usr/bin/env node
/**
 * P1 visual review — screenshots + metrics (read-only)
 */
import { chromium, devices } from 'playwright';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '../docs/reviews/screenshots/p1-visual');
const BASE = process.env.BASE_URL || 'http://localhost:8084';

const PAGES = [
  { slug: 'index', url: '/' },
  { slug: 'spatial-computing', url: '/spatial-computing.html' },
  { slug: 'portfolio', url: '/portfolio.html' },
  { slug: 'chi-siamo', url: '/chi-siamo.html' },
  { slug: 'innovation-hub', url: '/innovation-hub.html' },
  { slug: 'surgeree', url: '/surgeree.html' },
  { slug: 'br1ng', url: '/br1ng.html' },
  { slug: 'nottetempo', url: '/nottetempo.html' },
];

const VIEWPORTS = [
  { id: '1440x900', width: 1440, height: 900 },
  { id: '1280x800', width: 1280, height: 800 },
  { id: '1024x768', width: 1024, height: 768 },
  { id: '768x1024', width: 768, height: 1024, isMobile: true },
  { id: '390x844', width: 390, height: 844, isMobile: true },
  { id: '360x800', width: 360, height: 800, isMobile: true },
];

async function pageMetrics(page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    const overflowX = doc.scrollWidth > doc.clientWidth + 1;
    const sections = [...document.querySelectorAll('main section, main article')].map((el, i) => {
      const r = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return {
        index: i,
        id: el.id || null,
        className: (el.className || '').slice(0, 80),
        top: Math.round(r.top + window.scrollY),
        height: Math.round(r.height),
        bg: style.backgroundColor,
      };
    });
    return {
      scrollHeight: doc.scrollHeight,
      clientWidth: doc.clientWidth,
      overflowX,
      sectionCount: sections.length,
      sections,
      hasServiceGrid: !!document.querySelector('.service-grid'),
      hasNineServiceTitle: !!document.body.textContent.includes('Cosa costruiamo per le aziende'),
      hasScopriTuttiServizi: !!document.body.textContent.includes('Scopri tutti i servizi'),
      hasInvestSection: !!document.body.textContent.includes('Perché oggi conviene investire nello Spatial Computing'),
      hasNottetempoNarrative: !!document.querySelector('.portfolio-case__narrative'),
      portfolioVideoCount: document.querySelectorAll('[data-portfolio-video]').length,
    };
  });
}

async function capturePage(browser, pageDef, vp) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    isMobile: !!vp.isMobile,
    hasTouch: !!vp.isMobile,
  });
  const page = await context.newPage();
  const url = BASE + pageDef.url;
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(1500);

  const metrics = await pageMetrics(page);
  const dir = path.join(OUT, pageDef.slug, vp.id);
  await mkdir(dir, { recursive: true });

  await page.screenshot({
    path: path.join(dir, 'full-page.png'),
    fullPage: true,
  });
  await page.screenshot({
    path: path.join(dir, 'above-fold.png'),
    fullPage: false,
  });

  // Section strips (first 8 sections in main)
  const sectionTops = metrics.sections.slice(0, 10);
  for (let i = 0; i < Math.min(sectionTops.length, 6); i++) {
    const s = sectionTops[i];
    const y = Math.max(0, s.top - 60);
    const h = Math.min(s.height + 80, 1200);
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(dir, `section-${String(i + 1).padStart(2, '0')}.png`),
      clip: { x: 0, y: 0, width: vp.width, height: Math.min(h, vp.height) },
    });
  }

  await context.close();
  return { page: pageDef.slug, viewport: vp.id, url, metrics };
}

async function testPortfolioVideos(browser) {
  const results = { desktop: {}, mobile: {} };

  // Desktop 1440
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(BASE + '/portfolio.html', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    const playingAtTop = await page.evaluate(() => {
      const vids = [...document.querySelectorAll('[data-portfolio-video] video')];
      return vids.filter((v) => !v.paused).length;
    });

    await page.evaluate(() => window.scrollTo(0, document.getElementById('bring')?.offsetTop || 3000));
    await page.waitForTimeout(1200);

    const playingAtBring = await page.evaluate(() => {
      const vids = [...document.querySelectorAll('[data-portfolio-video] video')];
      const states = vids.map((v) => ({
        paused: v.paused,
        label: v.getAttribute('aria-label') || '',
      }));
      const playing = states.filter((s) => !s.paused).length;
      const bring = document.querySelector('#bring [data-portfolio-video] video');
      return { playing, states, bringPlaying: bring ? !bring.paused : null };
    });

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(800);
    const playingAfterScrollTop = await page.evaluate(() => {
      return [...document.querySelectorAll('[data-portfolio-video] video')].filter((v) => !v.paused).length;
    });

    results.desktop = { playingAtTop, playingAtBring, playingAfterScrollTop };
    await ctx.close();
  }

  // Mobile 390
  {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const page = await ctx.newPage();
    await page.goto(BASE + '/portfolio.html', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    const autoplayOnLoad = await page.evaluate(() => {
      return [...document.querySelectorAll('[data-portfolio-video] video')].filter((v) => !v.paused).length;
    });

    const bringBox = await page.locator('#bring [data-portfolio-video]');
    if (await bringBox.count()) {
      await bringBox.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);
      const beforeTap = await page.evaluate(() => {
        const v = document.querySelector('#bring [data-portfolio-video] video');
        return v ? { paused: v.paused, poster: v.poster, playsInline: v.playsInline } : null;
      });
      await bringBox.click();
      await page.waitForTimeout(800);
      const afterTap = await page.evaluate(() => {
        const v = document.querySelector('#bring [data-portfolio-video] video');
        return v ? { paused: v.paused, currentTime: v.currentTime } : null;
      });
      results.mobile = { autoplayOnLoad, beforeTap, afterTap };
    } else {
      results.mobile = { autoplayOnLoad, error: 'bring not found' };
    }
    await ctx.close();
  }

  return results;
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const allMetrics = [];
  const errors = [];

  for (const pageDef of PAGES) {
    for (const vp of VIEWPORTS) {
      try {
        console.log(`Capture ${pageDef.slug} @ ${vp.id}`);
        const m = await capturePage(browser, pageDef, vp);
        allMetrics.push(m);
      } catch (e) {
        errors.push({ page: pageDef.slug, viewport: vp.id, error: String(e) });
        console.error(e);
      }
    }
  }

  let videoTests = {};
  try {
    videoTests = await testPortfolioVideos(browser);
  } catch (e) {
    videoTests = { error: String(e) };
  }

  await browser.close();

  const summary = {
    base: BASE,
    capturedAt: new Date().toISOString(),
    metrics: allMetrics,
    videoTests,
    errors,
  };
  await writeFile(path.join(OUT, 'metrics.json'), JSON.stringify(summary, null, 2));
  console.log('Done. Metrics:', path.join(OUT, 'metrics.json'));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
