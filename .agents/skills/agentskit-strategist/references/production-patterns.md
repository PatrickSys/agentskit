# Production Context Engineering Patterns

Patterns that matter at production scale. These are not theoretical --
they come from systems processing millions of requests (Manus [S5]),
platform-level infrastructure (OpenAI [S2], Anthropic [S4]), and
empirical research on prompt caching [S26].

---

## KV-Cache Stability

**Source**: Manus [S5], Prompt Caching [S26]

**What**: The KV-cache stores precomputed key-value pairs from the model's
attention mechanism. When a prompt shares a prefix with a previous request,
the cached computation is reused -- dramatically reducing latency and cost.

**Why it matters**: Manus identifies KV-cache hit rate as the single most
important metric for production agents: "If I had to choose just one metric,
I'd argue that the KV-cache hit rate is the single most important metric
for a production-stage AI agent" [S5].

**Economics**: Cached tokens are 75-90% cheaper than uncached tokens across
all major providers. For agents making many calls with similar prefixes,
this translates to 80%+ cost reduction [S26].

**How to optimize**:
1. Keep system prompt content stable across invocations
2. Place static content (role, instructions, tool definitions) FIRST
3. Place variable content (conversation history, user input) LAST
4. Use deterministic serialization for tool definitions (same order every time)
5. Avoid reordering or dynamically adding/removing tools between calls
6. Use consistent formatting (whitespace, line breaks) across invocations

**Implementation checklist**:
- [ ] System prompt is identical across invocations (character-for-character)
- [ ] Tool definitions are serialized in deterministic order
- [ ] Conversation history appended AFTER static content
- [ ] No dynamic content injected into the system prompt prefix

---

## Cache-Friendly Prompt Structure

**Source**: Prompt Caching paper [S26] -- "Don't Break the Cache"

**Principle**: Prompts should be structured so that the longest possible
prefix is shared across invocations. Any change to the prefix invalidates
the cache for everything after it.

**Recommended structure**:
```
[STATIC: Role definition]           ← Cached (never changes)
[STATIC: Anti-patterns]             ← Cached
[STATIC: Algorithm/instructions]    ← Cached
[STATIC: Examples]                  ← Cached
[STATIC: Tool definitions]          ← Cached (if stable)
---
[VARIABLE: Conversation history]    ← Not cached (changes each turn)
[VARIABLE: Current user input]      ← Not cached
```

**Anti-pattern**: Injecting timestamps, request IDs, or session metadata
into the system prompt prefix. These change every invocation and break
the cache for everything after them.

**Cost impact** [S26]:
- 80% latency reduction for cache hits
- 90% input token cost reduction for cached prefix
- Break-even at ~2 requests with the same prefix

---

## Context Rot

**Source**: Anthropic CE [S4]

**What**: As context length grows, the model must track n-squared pairwise
relationships between all context items. This causes accuracy degradation
that increases with context length.

**Symptoms**:
- Agent starts making errors it didn't make earlier in the session
- Agent "forgets" instructions from the system prompt
- Tool calls become less accurate (wrong tool, wrong parameters)
- Output quality degrades without obvious cause

**Mitigation strategies**:
1. **Proactive compression**: Don't wait for the window to fill. Compress
   at 70-80% capacity, before degradation is visible [S6].
2. **Periodic re-anchoring**: Restate key instructions periodically in the
   conversation (not just at the start) [S5 recitation strategy].
3. **Context window monitoring**: Track token usage and trigger alerts or
   automatic compression at thresholds.
4. **Scope reduction**: For long sessions, narrow the agent's active scope
   to the current subtask rather than maintaining full project context.

---

## Diversity Injection

**Source**: Manus [S5]

**What**: In long sessions or repeated invocations, agents can fall into
pattern drift -- repeating the same approaches, using the same phrasing,
or getting stuck in local optima.

**How to counter**:
- Periodically randomize the order of examples or tool suggestions
- Introduce minor template variations to prevent formulaic responses
- Rotate prompt phrasings for repeated operations (e.g., different ways
  to ask "summarize the current state")
- After a failed approach, explicitly inject "try a different strategy"
  rather than retrying the same one

**When to recommend**: Long-running sessions (30+ minutes), agents that
make repeated similar calls, creative/exploratory tasks.

---

## Failure Evidence Preservation

**Source**: Manus [S5]

**What**: When compressing context, preserve error messages, failed tool calls,
and unsuccessful approaches. Models learn from observed mistakes.

**Why**: If failure evidence is compressed away, the agent has no memory of
what didn't work and will repeat the same failed approaches. This is
especially costly for tool-calling agents where failed API calls or
incorrect tool usage should inform subsequent attempts.

**Implementation**:
- When compressing, keep a "failures" section: tool name, error message,
  what was attempted, why it failed
- Limit to most recent 3-5 failures (older failures are less relevant)
- Include the failure in the compressed summary: "Attempted X, failed
  because Y -- do not retry without Z"

---

## MCP Considerations

**Source**: MCP Roadmap [S21]

**What**: The Model Context Protocol (MCP) is the de facto integration layer
for agent systems (97M+ monthly SDK downloads). Context strategies should
account for MCP's architecture.

**Relevance to context strategy**:
- Tool definitions via MCP servers add to context. Budget for this.
- MCP servers can be lazy-loaded (connect on first use) to reduce initial
  context footprint.
- MCP's Tasks primitive (2026 roadmap) enables agent-to-agent delegation
  with structured context handoff.
- Monitor MCP server count -- each server adds tool definitions to context.
  More servers = more context pressure.

---

## Cost Optimization Summary

| Strategy | Cost Reduction | Latency Reduction | Effort |
|---|---|---|---|
| Prompt prefix caching [S26] | 75-90% on cached tokens | 80% | Low |
| RAG on tools [S6] | Proportional to tool reduction | Proportional | Medium |
| Proactive compression [S4, S6] | Prevents expensive retries | Prevents degradation | Medium |
| Sub-agent return budgets [GSD] | Linear with budget reduction | Reduces orchestrator load | Low |
| JIT context loading [S4] | Avoids loading unused content | Avoids processing unused content | Low |
