#!/usr/bin/env python3
"""Aggiorna footer su tutte le pagine HTML pubbliche."""
from pathlib import Path

FOOTER_BLOCK = """      <div class="footer__company">
        <p class="footer__company-line"><strong>Touchlabs</strong></p>
        <p class="footer__company-line">Via Capo di Lucca 12, 40126 Bologna (BO), Italia</p>
        <p class="footer__company-line"><a href="mailto:info@touchlabs.it">info@touchlabs.it</a></p>
      </div>

      <div class="footer__bottom">
        <nav class="footer__legal" aria-label="Informazioni legali">
          <a href="/privacy.html">Privacy policy</a>
          <a href="/cookie.html">Cookie policy</a>
        </nav>
        <p class="footer__copy">&copy; 2026 Touchlabs. Tutti i diritti riservati.</p>
      </div>"""

OLD_BOTTOM = """      <div class="footer__bottom">
        <p class="footer__copy">&copy; 2026 Touchlabs. Tutti i diritti riservati.</p>
      </div>"""

public = Path(__file__).resolve().parent.parent / "public"
for path in sorted(public.glob("*.html")):
    text = path.read_text(encoding="utf-8")
    changed = False
    if OLD_BOTTOM in text:
        text = text.replace(OLD_BOTTOM, FOOTER_BLOCK)
        changed = True
    if "<li>Bologna, Italia</li>" in text:
        text = text.replace("<li>Bologna, Italia</li>", "<li>Via Capo di Lucca 12, Bologna</li>")
        changed = True
    if changed:
        path.write_text(text, encoding="utf-8")
        print("updated", path.name)
