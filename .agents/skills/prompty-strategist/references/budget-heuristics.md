# Token Budget Heuristics

Estimation patterns for sizing context components. These are heuristics based
on production experience and published guidance -- adjust based on actual
measurement for your specific system.

---

## Budget by System Type

| System Type | System Prompt | Per-Turn Context | Total Window Budget | Key Constraint |
|---|---|---|---|---|
| Simple single-agent | 300-1K | 1-5K | 8-16K | Low -- keep it lean |
| Multi-tool agent | 1-3K | 5-20K | 32-64K | Tool definitions dominate |
| Multi-agent (2-4) | 500-2K per agent | Varies by role | 64-128K total | Isolation budgets critical |
| Multi-agent (5+) | 500-2K per agent | Varies by role | 128K+ with compaction | Full WSCI required |
| Long-horizon assistant | 1-3K | 5-30K + compression | 128K+ with compaction | Compression triggers critical |
| RAG-heavy agent | 500-1K | 10-50K (retrieved) | 64-128K | Retrieval quality > quantity |

---

## Component-Level Budgets

### System Prompt Components

| Component | Typical Size | Notes |
|---|---|---|
| Role definition | 100-300 tokens | Purpose, identity, methodology |
| Anti-patterns | 100-200 tokens | 4-7 items, ~25-30 tokens each |
| Input contract | 50-150 tokens | What the agent receives |
| Output contract | 100-200 tokens | Numbered deliverables with format |
| Algorithm (core) | 200-500 tokens | Step-by-step, without examples |
| Examples (3) | 300-1000 tokens | 100-300 tokens per example |
| Quality check | 50-150 tokens | 5-10 binary check items |
| **Total** | **900-2,500 tokens** | **For a well-structured prompt** |

### Tool Definitions

| Tool Complexity | Per Tool | Notes |
|---|---|---|
| Simple (no params) | 30-50 tokens | Just name + description |
| Medium (3-5 params) | 100-200 tokens | Description + parameter schema |
| Complex (nested params) | 200-500 tokens | Full JSON schema + examples |
| **Loaded tools** | **Budget for 3-8 active** | **RAG on tools for 10+ [S6]** |

### Conversation History

| Turn Type | Per Turn | Notes |
|---|---|---|
| User message (short) | 20-100 tokens | Question or instruction |
| User message (with context) | 100-1000 tokens | Includes code, docs, or data |
| Agent response (short) | 50-200 tokens | Answer or confirmation |
| Agent response (with output) | 200-2000 tokens | Generated code, analysis, etc. |
| Tool call + result | 100-500 tokens | Varies by tool |
| **Compression trigger** | **At 70-80% capacity** | **Summarize oldest turns [S6]** |

---

## Sub-Agent Return Budgets

**Source**: GSD LL-SUBAGENT-RETURN-SIZE-MATTERS, Anthropic CE [S4]

The right return budget depends on what the downstream consumer needs, not
on how much the sub-agent has to say.

| Downstream Use | Budget | Content | Example |
|---|---|---|---|
| Routing decisions | 100-200 tokens | Decision + confidence + 1-line rationale | "Route to search agent (confidence: high). Query is factual, requires current data." |
| Human-readable summaries | 300-500 tokens | Structured summary for human review | Markdown with 3-5 bullet points, key findings, next steps |
| Agent-mediated discussion | 500-800 tokens | Detailed enough for another agent to act on | Findings with evidence, specific recommendations, caveats |
| Detailed technical handoff | 1000-2000 tokens | Full context for continuation | Complete state, decisions made, pending work, relevant code snippets |

**Anti-patterns**:
- 200-token limit for technical handoff: loses decision-relevant nuance [GSD LL]
- 2000-token limit for routing: wastes orchestrator context on unused detail
- No budget specified: sub-agents produce variable-length returns, causing
  unpredictable context consumption

---

## Progressive Disclosure Tiers

**Source**: agentskills.io [S15], Anthropic CE [S4]

| Tier | Budget | Content | When Loaded |
|---|---|---|---|
| 1. Discovery | ~100 tokens | Skill name + description (YAML frontmatter) | At startup, for ALL skills |
| 2. Instruction | < 5000 tokens | SKILL.md body (algorithm, contracts, examples) | When skill is activated |
| 3. Reference | As-needed | Files in references/ directory | When skill needs detailed rubrics, patterns, etc. |

**Design implications**:
- Tier 1 must be highly descriptive -- it's the relevance signal that
  determines whether the skill is activated
- Tier 2 must be self-contained enough for simple tasks
- Tier 3 is for depth -- rubrics, comprehensive examples, edge cases

---

## Budget Planning Worksheet

For a new system, fill in this template:

```
System: [name]
Model: [name] (context window: [X]K tokens)

Static context (cached):
  System prompt:        _____ tokens
  Tool definitions:     _____ tokens (N tools × avg size)
  Static examples:      _____ tokens
  Subtotal (cached):    _____ tokens

Dynamic context (per-turn):
  User input (avg):     _____ tokens
  Retrieved context:    _____ tokens
  Conversation history: _____ tokens (grows)
  Sub-agent returns:    _____ tokens
  Subtotal (dynamic):   _____ tokens

Budget:
  Total available:      _____ tokens (model window)
  Static (cached):      _____ tokens (____%)
  Dynamic headroom:     _____ tokens (____%)
  Output reserved:      _____ tokens (max generation)
  Compression trigger:  At ____% of dynamic headroom
```

---

## Rules of Thumb

1. **Reserve 20-30% of context window for output generation**. If the window
   is 128K, budget 90-100K for input context.

2. **Static content should be < 30% of total budget** for long sessions.
   More static content = less room for dynamic context.

3. **Compress at 70-80% capacity**, not 95%. By 95%, context rot has already
   degraded quality [S4, S6].

4. **Measure, don't guess**. These heuristics are starting points. After
   deployment, measure actual token usage and adjust.

5. **When in doubt, err toward less context**. "Smallest set of high-signal
   tokens" [S4] -- adding more context is not always better.
