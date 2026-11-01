import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const LIB_DIR = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(LIB_DIR, '..', '..');
export const SKILLS_DIR = path.join(ROOT, 'skills');
export const CATEGORIES = ['general', 'fullstack', 'marketing', 'gamedev'];

function frontmatter(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? m[1] : '';
}

function field(fm, key) {
  const re = new RegExp(`^${key}:\\s*(.*)$`, 'm');
  const m = fm.match(re);
  if (!m) return '';
  let v = m[1].trim();
  if (v === '' || v === '>' || v === '|' || v === '>-' || v === '|-' || v === '>+' || v === '|+') {
    const rest = fm.slice(fm.indexOf(m[0]) + m[0].length);
    const buf = [];
    for (const l of rest.split(/\r?\n/)) {
      if (/^\s+\S/.test(l)) buf.push(l.trim());
      else break;
    }
    v = buf.join(' ');
  }
  return v.replace(/^["']|["']$/g, '').trim();
}

export function shortDesc(d, n = 110) {
  d = (d || '').replace(/\s+/g, ' ').trim();
  if (d.length <= n) return d;
  return d.slice(0, n).replace(/\s\S*$/, '') + '…';
}

function walkDir(base, cat, out) {
  if (!fs.existsSync(base)) return;
  for (const entry of fs.readdirSync(base, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const skillFile = path.join(base, entry.name, 'SKILL.md');
    if (!fs.existsSync(skillFile)) continue;
    const fm = frontmatter(fs.readFileSync(skillFile, 'utf8'));
    const rel = path.relative(ROOT, path.join(base, entry.name)).split(path.sep).join('/');
    out.push({
      category: cat,
      dir: entry.name,
      name: field(fm, 'name') || entry.name,
      desc: field(fm, 'description'),
      rel,
    });
  }
}

function skillEntry(cat, dir) {
  const skillFile = path.join(dir, 'SKILL.md');
  if (!fs.existsSync(skillFile)) return null;
  const fm = frontmatter(fs.readFileSync(skillFile, 'utf8'));
  const name = path.basename(dir);
  return {
    category: cat,
    dir: name,
    name: field(fm, 'name') || name,
    desc: field(fm, 'description'),
    rel: path.relative(ROOT, dir).split(path.sep).join('/'),
  };
}

export function catalog() {
  const out = { general: [], fullstack: [], marketing: [], gamedev: [] };
  for (const cat of CATEGORIES) {
    if (cat === 'gamedev') {
      const router = skillEntry(cat, path.join(SKILLS_DIR, 'gamedev', 'router'));
      if (router) out.gamedev.push(router);
      const base = path.join(SKILLS_DIR, 'gamedev', 'skills');
      if (fs.existsSync(base)) {
        for (const group of fs.readdirSync(base, { withFileTypes: true })) {
          if (group.isDirectory()) walkDir(path.join(base, group.name), cat, out.gamedev);
        }
      }
    } else {
      walkDir(path.join(SKILLS_DIR, cat), cat, out[cat]);
    }
    out[cat].sort((a, b) => a.dir.localeCompare(b.dir));
  }
  return out;
}

export function totalCount(cat) {
  return CATEGORIES.reduce((s, c) => s + cat[c].length, 0);
}
