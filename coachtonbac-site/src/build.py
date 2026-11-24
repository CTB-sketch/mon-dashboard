#!/usr/bin/env python3
"""Génère le site statique Coach Ton Bac dans ../www à partir de src/pages.

Usage : python3 build.py
Chaque page commence par un bloc de métadonnées :
<!--
title: Titre de la page
description: Description pour Google (150 à 160 caractères)
nav: accueil|francais|philo|grand-oral|stages|tarifs|apropos|blog|rdv
-->
Raccourcis disponibles dans les pages : {{root}}, {{rdv}}, {{icon:nom}}, {{cta}}.
"""
import json
import re
import shutil
from pathlib import Path

SRC = Path(__file__).resolve().parent
OUT = SRC.parent / "www"
SITE = "https://coachtonbac.fr"

# ---------------------------------------------------------------- icônes
ICONS = {
    "arrow": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    "chev": '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
    "check": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M8 12.5l2.6 2.5L16 9.5"/></svg>',
    "seal": '<svg class="seal" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="20" cy="20" r="17"/><circle cx="20" cy="20" r="12.5" stroke-dasharray="2 2.4"/><path d="M14 20.5l4 4 8-9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    "phone": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>',
    "whatsapp": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19.1L4 20z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-1.8-.9-.8.8a4 4 0 0 1-2.3-2.3l.8-.8-.9-1.8L9 9.5z"/></svg>',
    "pen": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20l4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20z"/><path d="M13.5 7.5l3 3"/></svg>',
    "voice": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
    "owl": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5c2 1 4 1.5 8 1.5S18 6 20 5v9a8 8 0 0 1-16 0V5z"/><circle cx="9" cy="12" r="2"/><circle cx="15" cy="12" r="2"/><path d="M11.5 16h1"/></svg>',
    "podium": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 21h8M12 17v4M7 4h10l-1 8a4 4 0 0 1-8 0L7 4z"/></svg>',
    "calendar": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    "swoosh": '<svg class="swoosh" viewBox="0 0 150 14" fill="none" aria-hidden="true"><path d="M2 11C40 3 92 1 148 5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    "mark-a": '<svg class="step-mark" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="40" cy="40" r="36"/><circle cx="40" cy="40" r="27"/><circle cx="40" cy="40" r="18"/><circle cx="40" cy="40" r="9"/></svg>',
    "mark-b": '<svg class="step-mark" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M8 58c10-14 18-14 26 0s16 14 26 0 14-12 14-12"/><path d="M8 40c10-14 18-14 26 0s16 14 26 0 14-12 14-12"/><path d="M8 22c10-14 18-14 26 0s16 14 26 0 14-12 14-12"/></svg>',
    "mark-c": '<svg class="step-mark" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 44l14 14 38-38"/></svg>',
}

NAV = [
    ("francais", "bac-de-francais.html", "Bac de français"),
    ("philo", "philosophie.html", "Philosophie"),
    ("grand-oral", "grand-oral.html", "Grand Oral"),
    ("stages", "stages.html", "Stages"),
    ("tarifs", "tarifs.html", "Tarifs"),
    ("apropos", "a-propos.html", "Bruno Bertin"),
    ("blog", "blog/", "Blog"),
]

CTA_LABEL = "Réserver mon rendez-vous gratuit"
TEL_HREF = "tel:+33684296300"
TEL_TXT = "06 84 29 63 00"
WA_HREF = "https://wa.me/33684296300"
SIGNATURE = "La maîtrise vient de l’entraînement"


def header(root, nav):
    cur = ' aria-current="page"'
    links = "".join(
        f'<li><a href="{root}{href}"{cur if key == nav else ""}>{label}</a></li>'
        for key, href, label in NAV
    )
    return f'''<a class="skip" href="#contenu">Aller au contenu</a>
<header class="site-header">
  <div class="wrap">
    <nav class="nav" aria-label="Navigation principale">
      <a class="brand" href="{root}index.html" aria-label="Coach Ton Bac, accueil">
        <span class="brand-name">Coach Ton Bac</span>
        <span class="brand-sub">par Bruno Bertin</span>
      </a>
      <ul class="nav-links">{links}</ul>
      <a class="btn btn-primary nav-cta" href="{root}rendez-vous.html">Rendez-vous gratuit</a>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="mobile-nav"><span></span>Menu</button>
    </nav>
    <div class="mobile-nav" id="mobile-nav">
      <ul><li><a href="{root}index.html">Accueil</a></li>{links}</ul>
      <a class="btn btn-primary" href="{root}rendez-vous.html">{CTA_LABEL}</a>
    </div>
  </div>
</header>'''


def footer(root, nav):
    sticky = "" if nav == "rdv" else f'''
<div class="sticky-cta" role="complementary" aria-label="Réservation rapide">
  <p><strong>45 minutes offertes</strong>Sans engagement</p>
  <a class="icon-btn" href="{TEL_HREF}" aria-label="Appeler le {TEL_TXT}">{ICONS["phone"]}</a>
  <a class="btn btn-primary" href="{root}rendez-vous.html">Réserver</a>
</div>'''
    return f'''<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <p class="brand-name" style="margin:0 0 2px">Coach Ton Bac</p>
        <p class="brand-sig" style="margin:0 0 12px">{SIGNATURE}</p>
        <p>La gamme élèves de <strong>Bruno Bertin</strong>, ancien examinateur et membre de jury au bac de français. Préparation au bac de français, à la philosophie et au Grand Oral, en Première et en Terminale. En visio partout en France, en présentiel dans le secteur de Moulins (Allier).</p>
        <a class="btn btn-primary" href="{root}rendez-vous.html">{CTA_LABEL}</a>
      </div>
      <div>
        <h3>Préparations</h3>
        <ul>
          <li><a href="{root}bac-de-francais.html">Bac de français, écrit et oral</a></li>
          <li><a href="{root}philosophie.html">Philosophie</a></li>
          <li><a href="{root}grand-oral.html">Grand Oral</a></li>
          <li><a href="{root}stages.html">Stages des vacances</a></li>
          <li><a href="{root}tarifs.html">Tarifs</a></li>
        </ul>
      </div>
      <div>
        <h3>Le cabinet</h3>
        <ul>
          <li><a href="{root}a-propos.html">Bruno Bertin</a></li>
          <li><a href="{root}blog/">Blog</a></li>
          <li><a href="{root}rendez-vous.html">Rendez-vous et contact</a></li>
          <li><a href="{TEL_HREF}">{TEL_TXT}</a></li>
          <li><a href="{WA_HREF}" rel="noopener">WhatsApp</a></li>
          <li><a href="{root}mentions-legales.html">Mentions légales</a></li>
          <li><a href="{root}confidentialite.html">Confidentialité</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© <span data-year>2026</span> Bruno Bertin · Coach Ton Bac</span>
      <span>coachtonbac.fr</span>
    </div>
  </div>
</footer>{sticky}'''


def page(meta, body, root, rel_url):
    title = meta["title"]
    desc = meta["description"]
    canonical = SITE + "/" + rel_url
    noindex = '\n<meta name="robots" content="noindex">' if meta.get("noindex") else ""
    jsonld = meta.get("jsonld", "")
    return f'''<!doctype html>
<html lang="fr" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{canonical}">{noindex}
<meta name="theme-color" content="#0A1C35">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_FR">
<meta property="og:site_name" content="Coach Ton Bac">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{canonical}">
<meta property="og:image" content="{SITE}/assets/img/og-coachtonbac.png">
<link rel="icon" href="{root}assets/img/favicon.svg" type="image/svg+xml">
<link rel="preload" href="{root}assets/fonts/caslon-display.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="{root}assets/fonts/hanken-grotesk.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="{root}assets/css/site.css">
<script>document.documentElement.classList.remove("no-js")</script>
<script src="{root}assets/js/site.js" defer></script>{jsonld}
</head>
<body>
{header(root, meta.get("nav", ""))}
<main id="contenu">
{body}
</main>
{footer(root, meta.get("nav", ""))}
</body>
</html>
'''


def parse(path):
    raw = path.read_text(encoding="utf-8")
    m = re.match(r"\s*<!--(.*?)-->\s*", raw, re.S)
    meta = {}
    for line in m.group(1).strip().splitlines():
        k, _, v = line.partition(":")
        meta[k.strip()] = v.strip()
    return meta, raw[m.end():]


def typo_fr(body):
    """Espaces insécables avant : ; ? ! et à l'intérieur des guillemets, dans le texte seulement."""
    def fix(m):
        t = m.group(1)
        t = re.sub(r" ([:;?!])", "\u00a0\\1", t)
        t = t.replace("« ", "«\u00a0").replace(" »", "\u00a0»")
        return ">" + t + "<"
    return re.sub(r">([^<]+)<", fix, body)


def expand(body, root):
    body = typo_fr(body)
    body = body.replace("{{root}}", root).replace("{{rdv}}", root + "rendez-vous.html")
    body = body.replace(
        "{{cta}}",
        f'<a class="btn btn-primary" href="{root}rendez-vous.html">{CTA_LABEL} {ICONS["arrow"]}</a>',
    )
    return re.sub(r"\{\{icon:([a-z\-]+)\}\}", lambda m: ICONS[m.group(1)], body)


JSONLD_HOME = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Coach Ton Bac",
    "url": SITE + "/",
    "description": "Cours particuliers et stages de préparation au bac de français (écrit et oral), à la philosophie et au Grand Oral, pour les élèves de Première et de Terminale. En visio partout en France, en présentiel dans le secteur de Moulins (Allier).",
    "areaServed": [{"@type": "Country", "name": "France"}, {"@type": "City", "name": "Moulins"}],
    "founder": {"@type": "Person", "name": "Bruno Bertin", "jobTitle": "Professeur de français, ancien examinateur et membre de jury au bac de français"},
    "telephone": "+33684296300",
    "slogan": "La maîtrise vient de l’entraînement",
    "makesOffer": [
        {"@type": "Offer", "name": "Cours individuel", "price": "70", "priceCurrency": "EUR", "unitText": "heure"},
        {"@type": "Offer", "name": "Stage collectif bac de français, écrit", "price": "315", "priceCurrency": "EUR"},
        {"@type": "Offer", "name": "Stage collectif bac de français, oral", "price": "280", "priceCurrency": "EUR"},
        {"@type": "Offer", "name": "Stage collectif bac de français, écrit et oral", "price": "545", "priceCurrency": "EUR"},
        {"@type": "Offer", "name": "Premier rendez-vous de 45 minutes", "price": "0", "priceCurrency": "EUR"},
    ],
}


def build():
    if OUT.exists():
        shutil.rmtree(OUT)
    shutil.copytree(SRC / "assets", OUT / "assets")
    for name in ("static",):
        for f in (SRC / name).rglob("*"):
            if f.is_file():
                dest = OUT / f.relative_to(SRC / name)
                dest.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(f, dest)
    urls = []
    for path in sorted((SRC / "pages").rglob("*.html")):
        rel = path.relative_to(SRC / "pages").as_posix()
        depth = rel.count("/")
        root = "../" * depth
        if rel == "404.html":
            root = "/"  # la page 404 peut être servie à n'importe quelle profondeur
        meta, body = parse(path)
        if rel == "index.html":
            meta["jsonld"] = '\n<script type="application/ld+json">' + json.dumps(JSONLD_HOME, ensure_ascii=False) + "</script>"
        rel_url = "" if rel == "index.html" else (rel[:-10] if rel.endswith("/index.html") else rel)
        html = page(meta, expand(body, root), root, rel_url)
        dest = OUT / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(html, encoding="utf-8")
        if not meta.get("noindex"):
            urls.append(SITE + "/" + rel_url)
    sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    sitemap += "".join(f"  <url><loc>{u}</loc></url>\n" for u in urls) + "</urlset>\n"
    (OUT / "sitemap.xml").write_text(sitemap, encoding="utf-8")
    print(f"{len(urls)} pages indexables générées dans {OUT}")


if __name__ == "__main__":
    build()
