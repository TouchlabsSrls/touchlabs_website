#!/usr/bin/env python3
"""P0 smoke: link check, assets, redirects."""
from __future__ import annotations

import re
import sys
import urllib.error
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8084"
ROOT = Path(__file__).resolve().parent.parent / "public"

PAGES = [
    "index.html", "chi-siamo.html", "servizi.html", "portfolio.html",
    "innovation-hub.html", "contatti.html", "spatial-computing.html",
    "ai-applicata.html", "software-custom.html", "digital-experience.html",
    "surgeree.html", "nottetempo.html",
]

class LinkParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links: list[str] = []
        self.scripts: list[str] = []
        self.styles: list[str] = []

    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if tag == "a" and d.get("href", "").startswith("/"):
            self.links.append(d["href"])
        if tag == "link" and d.get("rel") == "stylesheet":
            self.styles.append(d.get("href", ""))
        if tag == "script" and d.get("src", "").startswith("/"):
            self.scripts.append(d["src"])


def fetch(url: str) -> tuple[int, dict[str, str], str]:
    req = urllib.request.Request(url, headers={"User-Agent": "P0-Validator/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            return r.status, dict(r.headers), r.read().decode("utf-8", "ignore")
    except urllib.error.HTTPError as e:
        return e.code, dict(e.headers), e.read().decode("utf-8", "ignore")


def main():
    errors: list[str] = []
    checked: set[str] = set()

    # Redirect
    code, headers, _ = fetch(f"{BASE}/configuratori-3d.html")
    loc = headers.get("Location", "")
    if code == 301 and "digital-experience.html" in loc:
        print(f"PASS redirect 301 -> {loc}")
    else:
        errors.append(f"redirect: expected 301, got {code} Location={loc}")

    # Sitemap must not list old URL
    _, _, sm = fetch(f"{BASE}/sitemap.xml")
    if "configuratori-3d" in sm:
        errors.append("sitemap contains configuratori-3d.html")
    else:
        print("PASS sitemap excludes configuratori-3d")

    # No google fonts in pages
    for page in PAGES:
        text = (ROOT / page).read_text(encoding="utf-8")
        if "fonts.googleapis.com" in text or "fonts.gstatic.com" in text:
            errors.append(f"{page}: still references Google Fonts")

    for page in PAGES:
        url = f"{BASE}/{page}" if page != "index.html" else f"{BASE}/"
        code, _, body = fetch(url)
        if code != 200:
            errors.append(f"{page}: HTTP {code}")
            continue
        print(f"PASS {page} -> {code}")
        p = LinkParser()
        p.feed(body)
        for href in p.links + p.styles + p.scripts:
            if href in checked or href.startswith("#") or href.startswith("mailto:"):
                continue
            checked.add(href)
            path = href.split("?")[0]
            if path.endswith(".html") or path.startswith("/assets/"):
                c, _, _ = fetch(f"{BASE}{path}")
                if c >= 400:
                    errors.append(f"broken asset/link {href} from {page} -> {c}")

    if errors:
        print("\nERRORS:")
        for e in errors:
            print(" -", e)
        sys.exit(1)
    print("\nAll automated checks passed.")


if __name__ == "__main__":
    main()
