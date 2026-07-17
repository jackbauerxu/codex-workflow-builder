import {readFile} from 'node:fs/promises';

const skill = await readFile(new URL('../../SKILL.md', import.meta.url), 'utf8');
const match = skill.match(/^---\n([\s\S]*?)\n---/);
if (!match) {
  throw new Error('SKILL.md must start with YAML frontmatter.');
}

const frontmatter = match[1];
const name = frontmatter.match(/^name:\s*(.+)$/m)?.[1]?.trim();
const description = frontmatter.match(/^description:\s*(.+)$/m)?.[1]?.trim();
if (name !== 'codex-workflow-builder') {
  throw new Error(`Unexpected skill name: ${name ?? '(missing)'}`);
}
if (!description?.startsWith('Use when ')) {
  throw new Error('Skill description must start with "Use when ".');
}
if (frontmatter.length > 1024) {
  throw new Error(`Skill frontmatter is too long: ${frontmatter.length} characters.`);
}

console.log('skill metadata checks passed');
