#!/usr/bin/env node
/**
 * Local QA audit — Touchlabs RC
 */
import { chromium } from 'playwright';
import { readFile, readdir, writeFile, stat } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const BASE = process.env.BASE_URL || 'http://localhost:8084';

const VIEWPORTS = [
  { id: '1440x900', width: 1440, height: 900 },
  { id: '1280x800', width: 1280, height: 800 },
  { id: '1024x768', width: 1024, height: 768 },
  { id: '768x1024', width: 768, height: 1024, mobile: true },
  { id: '390x844', width: 390, height: 844, mobile: true },
  { id: '360x800', width: 360, height: 800, mobile: true },
];

const PRIORITY_PAGES = [
  '/',
  '/chi-siamo.html',
  '/servizi.html',
  '/portfolio.html',
  '/innovation-hub.html',
  '/contatti.html',
  '/spatial-computing.html',
  '/ai-applicata.html',
  '/software-custom.html',
  '/digital-experience.html',
  '/surgeree.html',
  '/br1ng.html',
  '/nottetempo.html',
  '/scattolini.html',
  '/il-labirinto.html',
  '/luxury-living-group.html',
  '/privacy.html',
  '/cookie.html',
  '/configuratori-3d.html',
];

async function listHtmlPages() {
  const files = await readdir(PUBLIC);
  return files.filter((f) => f.endsWith('.html')).sort();
}

async function fetchStatus(url) {
  try {
    const res = await fetch(url, { redirect: 'manual' });
    return { status: res.status, location: res.headers.get('location') };
  } catch (e) {
    return { status: 0, error: String(e) };
  }
}

function resolveLink(href, pagePath) {
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return null;
  if (href.startsWith('http://') || href.startsWith('https://')) {
    if (href.startsWith(BASE)) return href.replace(BASE, '');
    return 'EXTERNAL:' + href;
  }
  const base = pagePath === '/' ? '/' : pagePath.replace(/[^/]+$/, '');
  if (href.startsWith('/')) return href.split('#')[0] || '/';
  const joined = path.posix.normalize(path.posix.join(base === '/' ? '' : base.replace(/^\//, ''), href));
  return '/' + joined.replace(/^\//, '').split('#')[0];
}

async function auditPageHtml(pageFile) {
  const filePath = path.join(PUBLIC, pageFile);
  const html = await readFile(filePath, 'utf8');
  const pagePath = pageFile === 'index.html' ? '/' : '/' + pageFile;
  const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() || '';
  const h1s = [...html.matchAll(/<h1\b[^>]*>/gi)].length;
  const links = [...html.matchAll(/href=["']([^"'#][^"']*)["']/gi)].map((m) => m[1]);
  const imgs = [...html.matchAll(/(?:src|poster)=["']([^"']+)["']/gi)].map((m) => m[1]);
  const videos = [...html.matchAll(/<video\b[^>]*>/gi)].map((m) => {
    const tag = m[0];
    const poster = tag.match(/poster=["']([^"']+)["']/i)?.[1] || null;
    const preload = tag.match(/preload=["']([^"']+)["']/i)?.[1] || null;
    const autoplay = /\bautoplay\b/i.test(tag);
    const muted = /\bmuted\b/i.test(tag);
    const playsinline = /\bplaysinline\b/i.test(tag);
    const aria = tag.match(/aria-label=["']([^"']+)["']/i)?.[1] || null;
    return { poster, preload, autoplay, muted, playsinline, aria };
  });
  const sources = [...html.matchAll(/<source\b[^>]*src=["']([^"']+)["']/gi)].map((m) => m[1]);
  const anchors = [...html.matchAll(/href=["']#([^"']+)["']/gi)].map((m) => m[1]);
  const oldUrls = [...html.matchAll(/configuratori-3d(?!\.html)/gi)].length;
  return { pageFile, pagePath, title, h1s, links, imgs, videos, sources, anchors, oldUrls, html };
}

async function checkAssets(assetPaths) {
  const missing = [];
  const checked = new Set();
  for (const raw of assetPaths) {
    if (!raw || raw.startsWith('http') || raw.startsWith('data:')) continue;
    const p = raw.split('?')[0];
    if (checked.has(p)) continue;
    checked.add(p);
    const url = BASE + (p.startsWith('/') ? p : '/' + p);
    const { status } = await fetchStatus(url);
    if (status !== 200) missing.push({ path: p, status });
  }
  return missing;
}

async function testForm() {
  const results = [];
  const base = { name: 'Test', email: 'test@example.com', message: 'Messaggio di test collaudo locale.', privacy_consent: '1' };

  async function post(fields) {
    const body = new URLSearchParams(fields);
    const res = await fetch(BASE + '/api/contact.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }
    return { status: res.status, data };
  }

  results.push({ test: 'missing name', ...(await post({ ...base, name: '' })) });
  results.push({ test: 'invalid email', ...(await post({ ...base, email: 'bad' })) });
  results.push({ test: 'missing privacy', ...(await post({ ...base, privacy_consent: '' })) });
  results.push({ test: 'honeypot filled', ...(await post({ ...base, website: 'spam' })) });
  results.push({ test: 'valid no smtp', ...(await post(base)) });
  return results;
}

async function playwrightAudit(browser, pages, priorityOnly) {
  const targets = priorityOnly
    ? PRIORITY_PAGES
    : pages.map((f) => (f === 'index.html' ? '/' : '/' + f));
  const responsive = [];
  const consoleErrors = [];
  const videoBehavior = [];

  for (const vp of VIEWPORTS) {
    for (const urlPath of targets) {
      const ctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        isMobile: !!vp.mobile,
        hasTouch: !!vp.mobile,
      });
      const page = await ctx.newPage();
      const errs = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') errs.push(msg.text());
      });
      page.on('pageerror', (e) => errs.push(String(e)));

      try {
        await page.goto(BASE + urlPath, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(600);
        const layout = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          h1Count: document.querySelectorAll('h1').length,
          skipLink: !!document.querySelector('.skip-link'),
        }));
        responsive.push({ urlPath, viewport: vp.id, ...layout, errors: errs.length });
        if (errs.length) consoleErrors.push({ urlPath, viewport: vp.id, errors: errs });
      } catch (e) {
        responsive.push({ urlPath, viewport: vp.id, error: String(e) });
      }
      await ctx.close();
    }
  }

  // Portfolio video behavior
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(BASE + '/portfolio.html', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);
    await page.evaluate(() => window.scrollTo(0, document.getElementById('bring')?.offsetTop || 3000));
    await page.waitForTimeout(1000);
    const desktop = await page.evaluate(() => ({
      playing: [...document.querySelectorAll('[data-portfolio-video] video')].filter((v) => !v.paused).length,
      playButtons: document.querySelectorAll('.portfolio-video-play').length,
    }));
    await ctx.close();
    videoBehavior.push({ mode: 'desktop', ...desktop });
  }
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    await page.goto(BASE + '/portfolio.html', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    const before = await page.evaluate(() => ({
      autoplay: [...document.querySelectorAll('[data-portfolio-video] video')].filter((v) => !v.paused).length,
      visiblePlay: [...document.querySelectorAll('.portfolio-video-play')].filter((b) => !b.hidden).length,
    }));
    await page.locator('#bring .portfolio-video-play').click().catch(() => {});
    await page.waitForTimeout(500);
    const after = await page.evaluate(() => {
      const v = document.querySelector('#bring [data-portfolio-video] video');
      const b = document.querySelector('#bring .portfolio-video-play');
      return { paused: v?.paused, btnHidden: b?.hidden };
    });
    await ctx.close();
    videoBehavior.push({ mode: 'mobile', before, after });
  }

  return { responsive, consoleErrors, videoBehavior };
}

async function inventoryVideos(pagesData) {
  const rows = [];
  for (const p of pagesData) {
    const seen = new Set();
    for (const src of p.sources) {
      if (seen.has(src)) continue;
      seen.add(src);
      let size = null;
      try {
        const fp = path.join(PUBLIC, src.replace(/^\//, ''));
        const s = await stat(fp);
        size = s.size;
      } catch {}
      const vid = p.videos[rows.length % p.videos.length] || {};
      rows.push({
        page: p.pageFile,
        src,
        sizeBytes: size,
        sizeMB: size ? (size / 1048576).toFixed(2) : null,
        poster: vid.poster || null,
        preload: vid.preload,
        autoplayHtml: vid.autoplay,
        muted: vid.muted,
        playsinline: vid.playsinline,
      });
    }
  }
  return rows;
}

async function findUnreferencedAssets() {
  const assetRoot = path.join(PUBLIC, 'assets');
  const referenced = new Set();
  const htmlFiles = await listHtmlPages();
  const cssJs = [];

  async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) await walk(full);
      else if (/\.(css|js)$/.test(e.name)) cssJs.push(full);
    }
  }
  await walk(PUBLIC);

  const allText = [];
  for (const f of htmlFiles) allText.push(await readFile(path.join(PUBLIC, f), 'utf8'));
  for (const f of cssJs) allText.push(await readFile(f, 'utf8'));
  const blob = allText.join('\n');
  const assetPaths = [];
  async function walkAssets(dir, prefix = '') {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const rel = path.posix.join(prefix, e.name);
      if (e.isDirectory()) await walkAssets(path.join(dir, e.name), rel);
      else if (!e.name.startsWith('.') && e.name !== '.DS_Store') assetPaths.push('/assets/' + rel.replace(/\\/g, '/'));
    }
  }
  await walkAssets(assetRoot);

  const unreferenced = [];
  for (const ap of assetPaths) {
    const base = ap.split('/').pop();
    if (!blob.includes(ap) && !blob.includes(base)) {
      let size = 0;
      try { size = (await stat(path.join(PUBLIC, ap.replace(/^\//, '')))).size; } catch {}
      unreferenced.push({ path: ap, sizeBytes: size });
    }
  }
  return unreferenced.sort((a, b) => b.sizeBytes - a.sizeBytes);
}

async function buildLinkGraph(pagesData) {
  const broken = [];
  const anchorIssues = [];
  const unreachable = new Set(pagesData.map((p) => p.pagePath));
  const linked = new Set();

  const pageIds = new Map();
  for (const p of pagesData) {
    const html = p.html;
    const ids = [...html.matchAll(/\bid=["']([^"']+)["']/gi)].map((m) => m[1]);
    pageIds.set(p.pagePath, new Set(ids));
  }

  for (const p of pagesData) {
    const { status, location } = await fetchStatus(BASE + p.pagePath);
    if (status !== 200 && !(p.pageFile === 'configuratori-3d.html' && (status === 301 || status === 302))) {
      broken.push({ from: p.pagePath, to: p.pagePath, status, type: 'page' });
    }
    for (const href of p.links) {
      const resolved = resolveLink(href, p.pagePath);
      if (!resolved) continue;
      if (resolved.startsWith('EXTERNAL:')) continue;
      linked.add(resolved);
      const { status, location } = await fetchStatus(BASE + resolved);
      if (status === 404) broken.push({ from: p.pagePath, to: resolved, status, href });
      if (status >= 300 && status < 400) {
        // redirect ok for configuratori
        if (resolved !== '/configuratori-3d.html') broken.push({ from: p.pagePath, to: resolved, status, href, redirect: location });
      }
    }
    for (const anchor of p.anchors) {
      const ids = pageIds.get(p.pagePath);
      if (!ids?.has(anchor)) anchorIssues.push({ page: p.pagePath, anchor: '#' + anchor });
    }
  }

  for (const p of pagesData) {
    if (linked.has(p.pagePath)) unreachable.delete(p.pagePath);
  }
  // remove '/' from unreachable always
  unreachable.delete('/');

  return { broken, anchorIssues, unreachable: [...unreachable], linked: [...linked].sort() };
}

async function main() {
  const htmlPages = await listHtmlPages();
  const pagesData = [];
  for (const f of htmlPages) pagesData.push(await auditPageHtml(f));

  const httpChecks = [];
  for (const p of pagesData) {
    const r = await fetchStatus(BASE + p.pagePath);
    httpChecks.push({ page: p.pagePath, ...r });
  }

  const allAssets = new Set();
  for (const p of pagesData) {
    p.imgs.forEach((i) => allAssets.add(i));
    p.sources.forEach((s) => allAssets.add(s));
  }
  const missingAssets = await checkAssets([...allAssets]);

  const linkReport = await buildLinkGraph(pagesData);
  const formResults = await testForm();
  const videoInventory = await inventoryVideos(pagesData);
  const unreferenced = await findUnreferencedAssets();

  const browser = await chromium.launch({ headless: true });
  const pw = await playwrightAudit(browser, htmlPages, true);
  await browser.close();

  const report = {
    generatedAt: new Date().toISOString(),
    base: BASE,
    htmlPages,
    httpChecks,
    pagesMeta: pagesData.map(({ html, ...rest }) => rest),
    missingAssets,
    linkReport,
    formResults,
    videoInventory,
    unreferencedAssets: unreferenced,
    playwright: pw,
  };

  const out = path.join(ROOT, 'docs/reviews/local-qa-audit.json');
  await writeFile(out, JSON.stringify(report, null, 2));
  console.log('Wrote', out);
  console.log('HTTP failures:', httpChecks.filter((x) => x.status !== 200 && x.status !== 301).length);
  console.log('Broken links:', linkReport.broken.length);
  console.log('Missing assets:', missingAssets.length);
  console.log('Overflow cases:', pw.responsive.filter((r) => r.overflow).length);
  console.log('Console errors:', pw.consoleErrors.length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
