# SOURCES.md -- Primary Source Citations

> Every technique in agentskit cites its primary source. No citation = no inclusion.
> This file is the evidence base referenced by all 3 skills.

---

## Tier 1: Prompt Engineering Guides

| # | Source | URL | Key Contribution |
|---|---|---|---|
| S1 | **Anthropic -- Claude Prompting Best Practices (Claude 4.6)** | https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/claude-prompting-best-practices | XML tags, role assignment, few-shot with `<example>` tags, long-context placement (docs TOP, query BOTTOM), adaptive thinking, agentic systems, self-correction chaining, CRITICAL overtrigger warning |
| S2 | **OpenAI -- GPT-5.4 Prompt Guidance (Mar 2026)** | https://developers.openai.com/api/docs/guides/prompt-guidance | Reasoning effort tuning, completeness contracts, verification loops, selective parallelism, dependency-aware tool calling, compaction API, output contracts, format locking, instruction priority hierarchy |
| S3 | **Anthropic -- Claude Code Best Practices** | https://www.anthropic.com/engineering/claude-code-best-practices | "Explore, plan, code, commit" workflow, CLAUDE.md as persistent context, think/ultrathink, multi-agent spawning, headless mode |

## Tier 2: Context Engineering

| # | Source | URL | Key Contribution |
|---|---|---|---|
| S4 | **Anthropic -- Effective Context Engineering for AI Agents** | https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents | "Smallest set of high-signal tokens," altitude calibration, tool design, progressive disclosure, compaction + tool result clearing, structured note-taking, sub-agent summaries (1000-2000 tokens), context rot |
| S5 | **Manus AI -- Context Engineering for Production Agents** | https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus | KV-cache hit rate as #1 metric, logit masking, recitation strategy, restorable compression, diversity injection, filesystem as extended context, preserve failure evidence |
| S6 | **LangChain -- Context Engineering for Agents** | https://blog.langchain.com/context-engineering-for-agents/ | Write/Select/Compress/Isolate four-bucket framework, RAG on tools (3x improvement), summarization at 95% capacity, state schema with selective field exposure |
| S7 | **ACE -- Agentic Context Engineering (ICLR 2026)** | https://arxiv.org/abs/2510.04618 | Contexts as "evolving playbooks." Optimizes offline (system prompts) AND online (agent memory). +10.6% on agent tasks. |

## Tier 3: Agent Design

| # | Source | URL | Key Contribution |
|---|---|---|---|
| S8 | **OpenAI -- Harness Engineering (Codex CLI, arXiv)** | https://arxiv.org/abs/2603.05344 | Explicit scaffolding before first prompt, dual-agent architecture, lazy tool discovery, adaptive context compaction, event-driven system reminders, explicit reasoning phases |
| S9 | **Google -- Eight Multi-Agent Design Patterns (Jan 2026)** | https://developers.googleblog.com/developers-guide-to-multi-agent-patterns-in-adk/ | Sequential, Coordinator, Parallel, Hierarchical, Generator-Critic, Iterative Refinement, HITL, Composite |
| S10 | **MASS -- Multi-Agent System Search** | https://arxiv.org/abs/2502.02533 | Prompts AND topologies both matter. Three-stage: local prompt, topology, global optimization. |
| S11 | **State of Context Engineering in 2026** | https://www.newsletter.swirlai.com/p/state-of-context-engineering-in-2026 | Five matured patterns: progressive disclosure, context compression, context routing, retrieval evolution, tool management via MCP. *Note: newsletter source -- practitioner perspective, not peer-reviewed.* |

## Tier 4: Foundations

| # | Source | URL | Key Contribution |
|---|---|---|---|
| S12 | **Chain-of-Thought Prompting** (Wei et al. 2022) | https://arxiv.org/abs/2201.11903 | Step-by-step reasoning. Foundation for reasoning effort tuning. |
| S13 | **ReAct: Reasoning + Acting** (Yao et al. 2022) | https://arxiv.org/abs/2210.03629 | Interleave reasoning traces with tool calls. Foundation for agentic prompts. |
| S14 | **Self-Refine** (Madaan et al. NeurIPS 2023) | https://arxiv.org/abs/2303.17651 | Generate -> critique -> refine loops. Validated in GSD plan-checker (max-3 cycles). |
| S15 | **agentskills.io Specification** | https://agentskills.io/specification | SKILL.md format, YAML frontmatter, progressive disclosure (100 -> 5000 -> as-needed tokens), 500 line recommended limit. Adopted by 35+ platforms. |
| S16 | **AGENTS.md de facto standard** | https://agents.md/ | Markdown-based agent guidance format. 60k+ projects. AAIF governance. |

## Tier 5: March 2026 Updates

| # | Source | URL | Key Contribution |
|---|---|---|---|
| S17 | **Anthropic -- 2026 Agentic Coding Trends Report (Feb 2026)** | https://resources.anthropic.com/hubfs/2026%20Agentic%20Coding%20Trends%20Report.pdf | Treating agentic coding as workflow design. Team-of-specialized-agents model. |
| S18 | **Anthropic -- Skill-Creator 2.0 & Evals (Mar 2026)** | https://tessl.io/blog/anthropic-brings-evals-to-skill-creator-heres-why-thats-a-big-deal | 4-mode operation: Create, Eval, Improve, Benchmark. Automated evals, blind A/B testing. |
| S19 | **Prompt Engineering: Contracts as Interface** | https://www.c-sharpcorner.com/article/prompt-engineering-in-2026-contracts-become-the-interface-series-the-next/ | Practitioner perspective on prompts as formal contracts: scope, output schema, ask/refuse rules, evidence policy. *Note: developer blog, not peer-reviewed -- treat as practitioner insight.* |
| S20 | **Test-Time Compute Scaling** | https://arxiv.org/abs/2512.02008 | Optimizing inference-time reasoning. *Note: primarily relevant to inference optimization, tangential to prompt engineering.* |
| S21 | **MCP 2026 Roadmap** | https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/ | Tasks primitive, agent-to-agent communication, governance, enterprise readiness. |
| S22 | **Prompt Caching & Cost Optimization** | https://promptbuilder.cc/blog/prompt-engineering-best-practices-2026 | Structure prompts for caching (static first, variable last). Cost and latency reduction through prefix caching. *Note: specific percentage claims in some summaries are unverified -- rely on provider documentation (S26) for validated numbers.* |
| S23 | **DeepMind -- Prompting Considered Harmful** | https://deepmind.google/research/publications/90773/ | Critical counterpoint: prompt-based interfaces should yield to structured interfaces. *Note: opinion/position piece by Meredith Ringel Morris (CACM), not empirical research. Our response: structured prompts (XML, contracts) ARE structured interfaces.* |
| S24 | **OpenAI -- Harness Engineering (blog)** | https://openai.com/index/harness-engineering/ | Harness = system prompts + tool definitions + context management + orchestration. |
| S25 | **SkillsBench -- Agent Skills Benchmark (Feb 2026)** | https://arxiv.org/abs/2602.12670 | First empirical benchmark. 86 tasks, 11 domains. Curated skills +16.2pp avg improvement. Focused skills (2-3 modules) outperform comprehensive docs. Self-generated skills provide NO measurable benefit. 16/84 tasks show negative deltas. |

## Tier 6: Post-Spec Additions

| # | Source | URL | Key Contribution |
|---|---|---|---|
| S26 | **Prompt Caching for Agents** (arxiv, Jan 2026) | https://arxiv.org/abs/2601.06007 | "Don't Break the Cache." 80% latency reduction, 90% cost reduction with prefix caching. Static content first, variable last. Deterministic serialization. |
| S27 | **Google Gemini 3 Prompting Guide** | https://docs.cloud.google.com/vertex-ai/generative-ai/docs/start/gemini-3-prompting-guide | Model-specific instruction placement: core requests must be final line, negative constraints at end. Temperature 1.0 optimal for reasoning. |
| S28 | **System Prompt Optimization with Meta-Learning** | https://arxiv.org/abs/2505.09666 | Bilevel framework: system prompt optimization decoupled from task-specific user prompts. Informs layered prompt architecture. |

---

## How Sources Are Used

- **[S#]** citations appear inline in SKILL.md files and references/
- Every technique, principle, or pattern must cite at least one source
- Tier 1-2 sources are load-bearing -- must be read before writing skills
- Tier 3-6 sources are reference -- consulted as needed for specific patterns
- Multiple sources for the same pattern increase confidence
- Contradictions between sources are noted and resolved explicitly
