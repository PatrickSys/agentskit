# Write / Select / Compress / Isolate (WSCI) Model

**Primary source**: LangChain Context Engineering for Agents [S6]
**Supporting**: Anthropic CE [S4], Manus [S5], ACE [S7]

---

## Overview

Context engineering has four concerns. Every agent system must address all four,
even if the answer for some is "not needed for this system." The model is
framework-agnostic -- it applies to any agent architecture.

```
┌─────────┐     ┌──────────┐     ┌──────────┐     ┌─────────┐
│  WRITE  │────>│  SELECT  │────>│ COMPRESS │────>│ ISOLATE │
│         │     │          │     │          │     │         │
│ What to │     │ What to  │     │ When to  │     │ How to  │
│ persist │     │ load     │     │ shrink   │     │ partition│
└─────────┘     └──────────┘     └──────────┘     └─────────┘
```

---

## Write: What Goes Into External Memory

**Core question**: What should the agent write to durable storage so that
information survives context resets, compaction, and session boundaries?

### Patterns

**Filesystem-as-Extended-Context** [S5]
Use the filesystem as a durable scratch space. Write structured files that
the agent can re-read later. This extends effective context beyond the
model's window.
- Status files (todo.md, progress.md)
- Decision logs (decisions.md with rationale)
- Research notes (findings with source URLs)
- Session checkpoints (full state snapshots)

**Structured Note-Taking** [S4]
For multi-session work, write observations, decisions, and rationale to
persistent notes. Structure matters -- use consistent formats so the agent
can parse its own notes efficiently.

**Recitation Strategy** [S5]
Continuously rewrite a status/todo file to push current objectives into the
most recent part of the context window, where attention is strongest.
Pattern: at the start of each major step, rewrite todo.md with current
priorities. This "recites" objectives into fresh attention.

**Checkpoint Patterns** [S4]
Save full state at major milestones for recovery. If context is lost
(window exceeded, session ended, error), the checkpoint enables cold restart.
Include: current objective, completed steps, pending steps, key decisions.

### When to Recommend Write
- Multi-turn sessions (information must survive between turns)
- Multi-session workflows (information must survive context resets)
- Complex tasks where decisions build on each other
- Systems where failure recovery is important

### When to Skip Write
- Single-turn tasks with no persistence need
- Simple Q&A agents
- Stateless utility agents

---

## Select: What Gets Loaded and When

**Core question**: What context should be in the agent's window at any given
moment, and how should it get there?

### Patterns

**JIT Loading with Lightweight Identifiers** [S4]
Load file names, summaries, or metadata first. Only load full content when
the agent determines it's needed. This keeps context lean.
- Phase 1: Load file listing (~100 tokens)
- Phase 2: Load relevant file content (~1000-5000 tokens)
- Phase 3: Load specific sections of large files

**RAG on Tools** [S6]
Instead of loading all tool definitions into context, retrieve only the
relevant tools for the current task. LangChain reports 3x improvement in
tool selection accuracy with this approach.
- Embed tool descriptions
- At each step, retrieve the 3-5 most relevant tools
- Load full tool definitions only for selected tools

**Progressive Disclosure** [S15]
Three-tier model for skills and context:
- Tier 1 (Discovery): ~100 tokens -- metadata for relevance matching
- Tier 2 (Instruction): < 5000 tokens -- full instructions when activated
- Tier 3 (Reference): As-needed -- detailed reference material

**Hybrid Retrieval** [S4]
Combine upfront loading of essential context (role, core instructions) with
autonomous exploration (agent decides what else to load). Don't force the
agent to work with a fixed context if exploration would help.

### When to Recommend Select
- Always. Every system benefits from intentional context selection.
- Especially important for: 10+ tools, large codebases, multi-file workflows

### Selection Anti-Patterns
- Loading everything upfront "just in case" -- causes context rot [S4]
- Loading all tools when only 2-3 are relevant -- 3x selection degradation [S6]
- Never refreshing loaded context in long sessions -- stale context

---

## Compress: When and How to Reduce

**Core question**: When context grows too large, what should be kept,
what should be summarized, and what should be dropped?

### Patterns

**Compaction at Major Milestones** [S2, S4]
After completing a significant subtask, summarize what was accomplished
and drop the detailed working context. Keep: decision, outcome, references.
Drop: reasoning steps, intermediate drafts, tool call details.

**Tool Result Clearing** [S4]
In long sessions, tool call results accumulate. Keep the decisions made
from tool results, but drop the raw results from deep history. If needed
later, the tool can be called again.

**Restorable Compression** [S5]
Drop full outputs but preserve references (file paths, URLs, commit hashes)
that allow on-demand restoration. The compressed version says "see file X"
instead of including file X's contents.

**Summarization at Capacity Threshold** [S6]
At 95% context capacity, trigger summarization of the oldest context.
Preserve most recent context at full resolution. LangChain recommends
a sliding window with summarization of evicted content.

**Failure Evidence Preservation** [S5]
When compressing, KEEP error messages and failed approaches. Models learn
from observed mistakes. Dropping failure evidence causes the agent to
repeat the same failed approaches.

### When to Recommend Compress
- Multi-turn sessions that approach context limits
- Long-horizon workflows spanning hours or days
- Systems with high tool-call volume

### Compression Anti-Patterns
- Lossy compression without restoration path [S5]
- Compressing failure evidence [S5]
- Compressing too early (small context, no pressure)
- Compressing too late (already at context rot threshold)

---

## Isolate: How to Partition Across Boundaries

**Core question**: In multi-agent systems, how should context be divided
between agents, and how should information flow between them?

### Patterns

**Sub-Agent Return Budgets** [GSD LL-SUBAGENT-RETURN-SIZE-MATTERS, S4]
Size return budgets by what the downstream consumer needs:

| Downstream Use | Budget | Rationale |
|---|---|---|
| Routing decisions | 100-200 tokens | Just the decision + confidence |
| Human-readable summaries | 300-500 tokens | Context without overwhelming |
| Agent-mediated discussion | 500-800 tokens | Nuance matters for downstream |
| Detailed technical handoff | 1000-2000 tokens | Full detail for continuation |

**State Schema with Selective Field Exposure** [S6]
Define a shared state object where each agent sees only the fields relevant
to its role. A search agent sees the query and search results. A synthesizer
sees the extracted claims and sources. Neither sees the other's internals.

**Fresh Context per Task** [GSD executor pattern]
Spawn sub-agents with clean context containing only task-relevant information.
Don't carry over the orchestrator's full context. Include: task description,
relevant subset of shared state, output contract.

### When to Recommend Isolate
- Multi-agent systems (2+ agents)
- Systems with clear role boundaries
- When different agents need different tools

### Isolation Anti-Patterns
- Sharing full context between all agents (context duplication, n-squared scaling)
- Undersized return budgets (200 tokens for technical handoff loses nuance)
- Oversized return budgets (2000 tokens for routing decisions wastes context)
- No state schema (agents pass unstructured blobs to each other)
