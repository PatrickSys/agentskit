#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SKILLS = {
  architect:   { dir: 'agentskit-architect',   cmd: 'architect.md' },
  strategist:  { dir: 'agentskit-strategist',  cmd: 'strategize.md' },
  evaluator:   { dir: 'agentskit-evaluator',   cmd: 'evaluate.md' },
};

const ALL_SKILL_NAMES = Object.keys(SKILLS);

function usage() {
  console.log(`
agentskit - Agent skills for prompt engineering, context strategy, and quality evaluation

Usage:
  agentskit init                          Install all skills + Claude Code commands
  agentskit init --skills architect,evaluator   Install specific skills
  agentskit init --no-commands            Install skills only (skip .claude/commands)

Skills: ${ALL_SKILL_NAMES.join(', ')}
`);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const command = args[0];

  if (!command || command === '--help' || command === '-h') {
    return { command: 'help' };
  }

  if (command !== 'init') {
    console.error(`Unknown command: ${command}\n`);
    return { command: 'help' };
  }

  let skills = ALL_SKILL_NAMES;
  let includeCommands = true;

  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--skills' && args[i + 1]) {
      skills = args[i + 1].split(',').map(s => s.trim());
      const invalid = skills.filter(s => !SKILLS[s]);
      if (invalid.length) {
        console.error(`Unknown skill(s): ${invalid.join(', ')}`);
        console.error(`Available: ${ALL_SKILL_NAMES.join(', ')}`);
        process.exit(1);
      }
      i++;
    } else if (args[i] === '--no-commands') {
      includeCommands = false;
    }
  }

  return { command: 'init', skills, includeCommands };
}

function copyDir(src, dest) {
  fs.cpSync(src, dest, { recursive: true, force: true });
}

function init(skills, includeCommands) {
  const pkgRoot = path.join(__dirname, '..');
  const cwd = process.cwd();
  const installed = [];

  // Copy skill directories
  const skillsDest = path.join(cwd, '.agents', 'skills');
  fs.mkdirSync(skillsDest, { recursive: true });

  for (const name of skills) {
    const skill = SKILLS[name];
    const src = path.join(pkgRoot, '.agents', 'skills', skill.dir);
    const dest = path.join(skillsDest, skill.dir);
    copyDir(src, dest);
    installed.push(`  .agents/skills/${skill.dir}/`);
  }

  // Copy command files
  if (includeCommands) {
    const cmdDest = path.join(cwd, '.claude', 'commands');
    fs.mkdirSync(cmdDest, { recursive: true });

    for (const name of skills) {
      const skill = SKILLS[name];
      const src = path.join(pkgRoot, '.claude', 'commands', skill.cmd);
      const dest = path.join(cmdDest, skill.cmd);
      fs.copyFileSync(src, dest);
      installed.push(`  .claude/commands/${skill.cmd}`);
    }
  }

  console.log(`\nInstalled agentskit (${skills.length} skill${skills.length > 1 ? 's' : ''}):\n`);
  installed.forEach(f => console.log(f));
  console.log(`\nUse /architect, /strategize, or /evaluate in Claude Code.\n`);
}

const opts = parseArgs(process.argv);

if (opts.command === 'help') {
  usage();
  process.exit(0);
}

init(opts.skills, opts.includeCommands);
