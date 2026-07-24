# DESIGN.md — BoutchSoftware site

Design source of truth for the public site (`boutch-pages/`, mirrored to `docs/`).
Inferred from the rendered site on 2026-05-29 and locked in after the design review.

> **Edit rule:** styles are inline per HTML page (no shared stylesheet yet). Apply
> any change to **both** `boutch-pages/` and `docs/`. See the repo's structure note.

## Voice
Calm, honest, hand-made. Not corporate, not flashy. "Software at human scale."
The product comes first on every page; brand prose is secondary (lives at the
bottom of the home page, not the top).

## Color tokens
Shared neutrals:
- `--text: #212121` (off-black body) / per-app darker variants (`#1d241d`, `#16201d`)
- `--muted: #757575` secondary text
- `--bg: #F5FBF5` (green pages) / `#F1FAF7` (PrepCalm)
- `--card: #FFFFFF`

Per-app accent (intentional theming):
- **Home — green:** `--green / --brand: #5BB65A`, dark `#3D8C3C`
- **PrepCalm — teal:** `--brand: #0E8174`, dark `#00665A`

Rules: accent is used for headings, primary buttons, nav, links. Keep ≤8 colors
per page. No purple/gradient slop. Footer/inline links use the accent-dark color.

## Typography
- Stack: `'Segoe UI', system-ui, Arial, sans-serif` (system; candidate for a
  self-hosted humanist sans later).
- Body 16px, line-height ~1.65.
- `h1` (hero) 2.4–2.5rem / weight 700–800.
- Section labels (`h2`): 0.82rem, UPPERCASE, letter-spacing ~1.5px, **weight 700**,
  in the accent-dark color — they must read as headings, not grey fine print.
- Card titles (`h3`) ~1.05–1.2rem / 700.

## Spacing & shape
- Radius: `--radius: 14px` (home) / `18px` (app pages); pills/buttons `20px`–`999px`.
- Card shadow: `0 1px 4px rgba(0,0,0,.08)` (soft).
- Content max-width: 760–920px, centered.

## Buttons & actions
- **Primary:** filled accent, white text (one per card/section).
- **Secondary:** outline (1.5–2px accent border), accent text; fills on hover.
- **Soon:** muted grey, `cursor: default`.
- **Touch targets ≥44px** (min-height + inline-flex centering) — non-negotiable;
  this is a mobile-app site.

## Layout conventions
- Sticky top nav, centered links, current page underlined in accent.
- Hero: full-width accent band (gradient on app pages), centered icon + h1 + tagline.
- Bilingual FR/EN toggled in place (`body.show-en`); toggle labelled with a `⇄`
  swap glyph, never a directional scroll arrow.
- One job per section. Cards only when the card is the content (an app, a kit).

## Avoid (slop blacklist)
Purple/indigo gradients, 3-column icon-in-circle feature grids, centered-everything,
decorative blobs, emoji as primary design elements, generic "Unlock the power of…"
hero copy.
