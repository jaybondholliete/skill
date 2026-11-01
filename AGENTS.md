# skill-vault — repo conventions

207 Agent Skills curated into one installable collection, README skinned in the
Geometry Dash theme shared with `jaybondholliete/jaybondholliete`.

## Layout

- `skills/<category>/<name>/SKILL.md` — categories: `general`, `fullstack`,
  `marketing`, `gamedev`. Dir name must equal frontmatter `name`.
- `skills/gamedev/` is the intact upstream repo
  `gamedev-skills/awesome-gamedev-agent-skills` (minus `.git`/`.github`) —
  Apache-2.0, keep its LICENSE + NOTICE. Its skills live one level deeper at
  `skills/gamedev/skills/<group>/<name>/` plus `skills/gamedev/router/`.
- `.claude-plugin/marketplace.json` — generated, do not hand-edit.
- `conf/theme.json` — GD palette. `scripts/lib/svg.js` — SVG primitives
  (cube, spikes, difficulty faces, panels). Both copied from the profile repo.
- `assets/*.svg` — generated README artwork.

## Regenerating

- `node scripts/build-catalog.js` — rewrites `marketplace.json` and the README
  catalog between `<!-- CATALOG:BEGIN/END -->`; asserts all paths exist.
- `node scripts/gen-banner.js` — `assets/banner.svg` (count comes from the catalog).
- `node scripts/gen-panels.js` — `assets/panel-<category>.svg` ×4.
- Zero dependencies, Node 20+.

## Adding a skill

1. `skills/<category>/<name>/SKILL.md` with frontmatter `name` + `description`.
2. `node scripts/build-catalog.js` (updates manifest + README catalog + counts).
3. `node scripts/gen-banner.js && node scripts/gen-panels.js` (updates counts in art).
4. If it came from elsewhere: add the source to `ATTRIBUTION.md` and the
   license text to `licenses/` (or the skill's own dir for copyleft/Apache).

## Attribution policy

Skills under `skills/` are upstream works under their own licenses — see
`ATTRIBUTION.md` and `NOTICE.md`. Original work here is only: layout, README,
artwork, generator scripts (MIT, root `LICENSE`). Never strip upstream credit.
