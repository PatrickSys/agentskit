# prompty

**The standard library for meta-prompting.**

3 agent skills that encode meta-prompting knowledge from 28 primary sources -- Anthropic, OpenAI, Google, Manus, LangChain, ACE, GSD-Distilled, and more -- into reusable, evidence-backed, vendor-neutral components any AI coding agent can invoke.

## Why

When you tell an AI agent "create a skill for X" or "write a system prompt for Y," the agent draws on its training data. Training data is a hypothesis, not a standard.

Prompty gives agents something better: curated, cited, battle-tested engineering patterns from the full March 2026 landscape. Every technique cites its primary source. No citation = no inclusion.

Key insight from [SkillsBench](https://arxiv.org/abs/2602.12670) (Feb 2026): **self-generated skills provide no measurable benefit**, while focused expert-curated skills give +16.2pp average improvement across 86 tasks. Prompty encodes curated knowledge, not auto-generated patterns.

## Skills

| Skill | What It Does | Claude Code |
|---|---|---|
| **prompty-architect** | Generates system prompts, role contracts, SKILL.md files, AGENTS.md sections | `/architect <task>` |
| **prompty-strategist** | Designs context engineering strategies (Write/Select/Compress/Isolate) | `/strategize <system>` |
| **prompty-evaluator** | Reviews and scores prompts against SOTA quality criteria | `/evaluate <prompt>` |

### prompty-architect

Takes a task description and produces a complete harness component. Auto-detects output format (system prompt, SKILL.md, role contract, AGENTS.md section). Applies 5 structural principles (output contracts, scope boundaries, anti-patterns, input contracts, self-check) and selects from 10 tactical techniques by problem type (CoT, ReAct, Self-Refine, XML structure, progressive disclosure, etc.).

### prompty-strategist

Designs context engineering strategies using the WSCI model (Write/Select/Compress/Isolate). Covers what to persist, what to load, when to compress, and how to isolate context across agent boundaries. Includes token budgets, production considerations (KV-cache, context rot, caching), and implementation priority.

### prompty-evaluator

Reviews any prompt artifact against 5 quality dimensions (Clarity, Specificity, Context Design, Completeness, Structure) and 13 SOTA compliance checks. Works standalone or embedded as a self-check within architect and strategist.

## Installation

### Any AI Agent (agentskills.io)

Copy `.agents/skills/prompty-*` into your project:

```
your-project/
  .agents/
    skills/
      prompty-architect/
      prompty-strategist/
      prompty-evaluator/
```

35+ platforms auto-discover skills in `.agents/skills/`, including Claude Code, Cursor, GitHub Copilot, Codex, Gemini CLI, OpenCode, and more.

### Claude Code

Copy both `.agents/skills/prompty-*` and `.claude/commands/` into your project for slash command access (`/architect`, `/strategize`, `/evaluate`).

## How It Works

1. **Architect** analyzes your task, classifies the output type, applies structural principles, selects tactical techniques, generates the artifact, and self-checks against evaluator criteria before delivering.

2. **Strategist** assesses your system's context needs across 5 dimensions, designs a WSCI strategy, adds production considerations, and produces a token budget table.

3. **Evaluator** scores artifacts on 5 quality dimensions (1-10 each), runs SOTA compliance checks, and provides top 3 improvements with before/after examples.

Composition: `architect -> evaluate -> refine` or `strategist -> architect (informed by strategy) -> evaluate`.

## Sources

All 28 primary sources are documented in [SOURCES.md](SOURCES.md). Key sources include:

- Anthropic: Claude Prompting Best Practices, Context Engineering, Claude Code Best Practices
- OpenAI: GPT-5.4 Prompt Guidance, Harness Engineering
- Google: Multi-Agent Design Patterns, Gemini 3 Guide
- Research: Chain-of-Thought (Wei 2022), ReAct (Yao 2022), Self-Refine (Madaan 2023), ACE (ICLR 2026), SkillsBench (Feb 2026)
- Production: Manus Context Engineering, LangChain WSCI Model, GSD-Distilled

## Design

See [SPEC.md](SPEC.md) for full design decisions, competitive landscape, and implementation rationale.

## License

MIT
