import fs from 'node:fs';
import path from 'node:path';
import { catalog, totalCount, shortDesc, CATEGORIES, ROOT } from './lib/catalog.js';

const cat = catalog();
const total = totalCount(cat);

const PLUGIN_DESC = {
  general: 'Agent workflow skills — brainstorming, TDD, debugging, plans, code review, plus utility skills (headroom, find-skills, stop-slop, unity-mcp).',
  fullstack: 'Full-stack engineering skills — 66 expert personas covering languages, frameworks, cloud, DevOps, data, and review.',
  marketing: 'Marketing skills — CRO, copywriting, SEO, ads, analytics, email, pricing, launches, and growth.',
  gamedev: 'Game-dev skills + router — 12 engines (Godot, Unity, Unreal, Roblox, Phaser, PixiJS, three.js, Bevy, Defold, pygame, LÖVE, Ebitengine), disciplines, genres, and workflows.',
};

// 1) marketplace.json — 4 plugins, one per category
const marketplace = {
  name: 'skill-vault',
  owner: { name: 'jaybondholliete' },
  metadata: {
    description: '207 Agent Skills in one installable vault — workflow, full-stack, marketing, and game-dev, skinned for the dash.',
  },
  plugins: CATEGORIES.map((c) => ({
    name: c,
    source: './',
    description: PLUGIN_DESC[c],
    strict: false,
    skills: cat[c].map((s) => `./${s.rel}`),
  })),
};

const mpPath = path.join(ROOT, '.claude-plugin', 'marketplace.json');
fs.mkdirSync(path.dirname(mpPath), { recursive: true });
fs.writeFileSync(mpPath, JSON.stringify(marketplace, null, 2) + '\n');

// assert every listed path exists
for (const p of marketplace.plugins) {
  for (const s of p.skills) {
    const dir = path.join(ROOT, s.slice(2));
    if (!fs.existsSync(path.join(dir, 'SKILL.md'))) {
      throw new Error(`marketplace path missing SKILL.md: ${s}`);
    }
  }
}

// 2) README catalog block
const SECTION_TITLE = {
  general: 'GENERAL · workflow & debugging',
  fullstack: 'FULLSTACK · dev stack arsenal',
  marketing: 'MARKETING · growth engine',
  gamedev: 'GAMEDEV · 12 engines, one router',
};

let block = '<!-- CATALOG:BEGIN -->\n';
for (const c of CATEGORIES) {
  block += `\n<details>\n<summary><b>${SECTION_TITLE[c]} — ${cat[c].length} skills</b></summary>\n\n`;
  block += '| skill | what it does |\n|---|---|\n';
  for (const s of cat[c]) {
    block += `| \`${s.name}\` | ${shortDesc(s.desc)} |\n`;
  }
  block += `\n</details>\n`;
}
block += '\n<!-- CATALOG:END -->';

const readmePath = path.join(ROOT, 'README.md');
const readme = fs.existsSync(readmePath) ? fs.readFileSync(readmePath, 'utf8') : '';
if (!readme.includes('<!-- CATALOG:BEGIN -->')) {
  console.log('README has no catalog markers — marketplace.json written, catalog block skipped.');
} else {
  fs.writeFileSync(readmePath, readme.replace(/<!-- CATALOG:BEGIN -->[\s\S]*?<!-- CATALOG:END -->/, block));
  console.log(`README catalog updated.`);
}

console.log(`marketplace.json: ${marketplace.plugins.length} plugins, ${total} skills.`);
for (const c of CATEGORIES) console.log(`  ${c}: ${cat[c].length}`);
