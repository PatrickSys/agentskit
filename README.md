# agentskit

Agent skills for prompt engineering, context strategy, and quality evaluation.

3 skills you install into your project. Your AI coding agent uses them to produce better prompts, system instructions, SKILL.md files, and context strategies — drawing on patterns from Anthropic, OpenAI, Google, and 25 other cited sources instead of improvising from training data.

## Install

```
npx agentskit init
```

Copies skills into `.agents/skills/` ([agentskills.io](https://agentskills.io) compatible) and Claude Code commands into `.claude/commands/`.

Install specific skills:

```
npx agentskit init --skills architect,evaluator
```

## Skills

| Skill | What it does | Claude Code |
|---|---|---|
| **agentskit-architect** | Generates system prompts, SKILL.md files, role contracts | `/architect <task>` |
| **agentskit-strategist** | Designs context engineering strategies (WSCI model) | `/strategize <system>` |
| **agentskit-evaluator** | Scores prompts against quality criteria + SOTA compliance | `/evaluate <prompt>` |

### agentskit-architect

Takes a task description and produces a complete harness component. Auto-detects format (system prompt, SKILL.md, role contract, AGENTS.md section). Applies structural principles and selects techniques by problem type.

### agentskit-strategist

Designs context strategies using Write/Select/Compress/Isolate. Covers what to persist, what to load, when to compress, how to isolate context across agent boundaries. Includes token budgets and production considerations.

### agentskit-evaluator

Reviews prompt artifacts against 5 quality dimensions and 13 compliance checks. Works standalone or embedded as a self-check within other skills.

## How it works

These are [agentskills.io](https://agentskills.io) skills — structured Markdown files that AI coding agents load as instructions. When you invoke `/architect`, your agent reads the skill's SKILL.md, follows its algorithm, loads reference files as needed, and produces the artifact.

Every technique in the skills cites its primary source. The full list of 28 sources is in [SOURCES.md](SOURCES.md).

## Manual install

Copy `.agents/skills/agentskit-*` into your project. For Claude Code, also copy `.claude/commands/`.

## License

MIT
