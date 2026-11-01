import fs from 'node:fs';
import path from 'node:path';
import { catalog, CATEGORIES, ROOT } from './lib/catalog.js';
import { svgDoc, text, panel, difficultyIcon, glowFilter, FONT_MONO } from './lib/svg.js';

const W = 440, H = 230;
const t = JSON.parse(fs.readFileSync(path.join(ROOT, 'conf', 'theme.json'), 'utf8'));
const cat = catalog();

const META = {
  general:   { lvl: 'LVL 01', tier: 'normal', flavor: 'workflow & debugging',  stars: '★ 2',  blurb: 'brainstorm, plan, test, review' },
  fullstack: { lvl: 'LVL 02', tier: 'demon',  flavor: 'dev stack arsenal',     stars: '★ 10', blurb: '66 experts, every stack' },
  marketing: { lvl: 'LVL 03', tier: 'hard',   flavor: 'growth engine',         stars: '★ 6',  blurb: 'CRO, SEO, ads, launches' },
  gamedev:   { lvl: 'LVL 04', tier: 'insane', flavor: '12 engines, one router', stars: '★ 8', blurb: 'godot to unreal to roblox' },
};

const defs = `
  ${glowFilter('glow-green', t.green, 4)}
  ${glowFilter('glow-cyan', t.cyan, 3)}
  ${glowFilter('glow-magenta', t.magenta, 3)}`;

for (const c of CATEGORIES) {
  const m = META[c];
  const count = cat[c].length;
  const body = `
  <rect width="${W}" height="${H}" fill="${t.bg}"/>
  ${panel(10, 10, W - 20, H - 20, `${m.lvl} · ${c.toUpperCase()}`, `// ${m.stars} rated`, t)}

  <g>${difficultyIcon(m.tier, 84, 128, 96)}</g>
  ${text(84, 196, m.tier.toUpperCase(), { size: 13, fill: t.dim, family: FONT_MONO, anchor: 'middle', spacing: 3 })}

  ${text(160, 88, c.toUpperCase(), { size: 26, fill: t.text, weight: 800, spacing: 3, stroke: '#06081c', strokeWidth: 4, filter: 'url(#glow-cyan)' })}
  ${text(160, 114, m.flavor, { size: 13, fill: t.dim, weight: 400 })}

  <g>
    <rect x="160" y="132" width="132" height="26" rx="5" fill="${t.panel}" stroke="${t.border}"/>
    ${text(172, 150, `${count} SKILLS`, { size: 13, fill: t.lime, family: FONT_MONO, spacing: 1, filter: 'url(#glow-green)' })}
  </g>
  ${text(160, 182, m.blurb, { size: 11.5, fill: t.cyan, family: FONT_MONO })}
  ${text(160, 202, '> jump in', { size: 11, fill: t.magenta, family: FONT_MONO })}
`;

  const out = svgDoc(W, H, defs, body);
  const file = path.join(ROOT, 'assets', `panel-${c}.svg`);
  fs.writeFileSync(file, out);
  console.log(`wrote ${path.relative(process.cwd(), file)} (${count} skills)`);
}
