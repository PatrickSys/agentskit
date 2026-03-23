# Structural Principles (Always Apply)

These 5 principles are applied to EVERY generated artifact regardless of type.
They are non-negotiable engineering standards backed by primary sources.
The depth of application scales with artifact complexity [S4 altitude calibration].

---

## 1. Output Contracts

**Sources**: OpenAI 5.4 [S2] (completeness contracts, format locking),
practitioner perspective on contracts-as-interface [S19]

**What**: Define exactly what the prompt/skill produces. Every deliverable is
numbered with format specification and constraints.

**Why**: Without output contracts, every invocation produces differently-structured
output, making downstream processing unreliable [S2]. Format locking prevents
the model from drifting to a different output structure mid-response [S2].

**Implementation by artifact type**:

| Artifact | Output Contract Depth |
|---|---|
| System prompt | 2-4 numbered deliverables with format hints |
| SKILL.md | Full `<output_contract>` XML section |
| Role contract | Full `<output_contract>` with schema/format for each item |
| AGENTS.md | Implicit -- describes governance expectations |

**Example** (SKILL.md level):
```xml
<output_contract>
You produce:
1. Review report (markdown): severity-ranked issues with file/line references
2. Issue count by severity: {critical: N, warning: N, info: N}
3. Suggested fixes: code blocks with before/after for each critical issue
4. Summary: 2-3 sentences, overall assessment
</output_contract>
```

---

## 2. Scope Boundaries

**Sources**: GSD role contracts (all 10 roles use scope boundaries),
SPEC.md D5 (output format detection)

**What**: Explicit declaration of what is in scope, out of scope, and heuristics
for judgment calls in grey areas.

**Why**: Without scope boundaries, agents attempt tasks outside their expertise,
producing low-quality output or hallucinating capabilities they don't have.
GSD's LL-SYSTEMIC-ROLE-FLATTENING showed that agents without scope boundaries
bleed between responsibilities.

**Three-part structure**:
```
In scope: [specific list of what this agent handles]
Out of scope: [specific list of what it does NOT handle]
Judgment call: [heuristic for grey areas -- when in doubt, do X]
```

**Example**:
```
In scope: bugs, security vulnerabilities, error handling gaps, logic errors.
Out of scope: style preferences, naming conventions, performance optimization
(unless it causes correctness issues).
Judgment call: if a pattern is technically correct but fragile under concurrent
access, flag it as a warning with a note explaining the risk.
```

**Scaling**: Simple prompts can use inline scope. Complex role contracts should
use a dedicated `<scope>` or fold scope into `<role>`.

---

## 3. Anti-Patterns (Early Placement)

**Sources**: Anthropic [S1] (XML structure, attention patterns),
GSD all role contracts (anti-patterns section is universal)

**What**: A dedicated section documenting specific "don't do this" failure modes,
placed after the role definition and before the algorithm.

**Why**: Early placement ensures high attention weight -- models attend most to
the beginning of context [S1]. Specific anti-patterns prevent the most common
failure modes. GSD production experience (10 roles, 44 commits of hardening)
shows anti-patterns placed after role catch issues before the agent begins work.

**Guidelines**:
- 4-7 items per artifact (not exhaustive, focus on high-impact mistakes)
- Each item: what not to do + brief why
- Place immediately after `<role>`, before `<algorithm>`
- Use `<anti_patterns>` XML tag for structured artifacts

**Example**:
```xml
<anti_patterns>
- Do not assert facts without a source citation -- every claim needs a reference
- Do not include sources you haven't actually read -- cite only verified URLs
- Do not generate a wall of text -- use structured sections with headers
- Do not skip the self-check -- run all verification items before delivering
</anti_patterns>
```

---

## 4. Input Contracts with Extraction Guidance

**Sources**: Anthropic CE [S4] (JIT context loading, "smallest set of high-signal tokens"),
GSD approach-explorer (extraction guidance in input contracts)

**What**: Specification of what the artifact expects as input, including what to
extract from referenced files to prevent context bloat.

**Why**: Without extraction guidance, agents load entire files when only specific
sections matter. This wastes context window and increases context rot -- accuracy
degrades as context length grows due to n-squared pairwise relationships [S4].

**Implementation**:
```xml
<input_contract>
You receive:
1. Task description: what the agent should do
2. (Optional) SPEC.md: read ONLY locked decisions and deferred items
   (skip project description, requirements prose, historical context)
3. (Optional) Existing code: read function signatures and types
   (skip implementation details unless directly relevant)
</input_contract>
```

**Key pattern**: "From [file]: extract [specific content] ONLY (skip [what to ignore])"

---

## 5. Self-Check / Verification Loop

**Sources**: OpenAI [S2] (verification loops), Self-Refine [S14]
(generate-critique-refine, NeurIPS 2023), GSD plan-checker (max 3 cycles)

**What**: Explicit checklist before final output. Check items are specific and
binary (yes/no), not vague ("ensure quality").

**Why**: Self-Refine [S14] demonstrates that explicit critique-refine loops improve
output quality across tasks. OpenAI [S2] codifies verification loops as a prompt
engineering best practice. GSD validates this in production with max-3-cycle
plan-check loops.

**Implementation**:
```xml
<quality_check>
Before delivering, verify:
1. Every critical issue has a suggested fix [yes/no]
2. No claims made without source citation [yes/no]
3. Output matches the output contract format [yes/no]
4. Scope boundaries are respected (no out-of-scope content) [yes/no]
5. Authority language is calibrated (no CRITICAL outside gates) [yes/no]
</quality_check>
```

**Guidelines**:
- 5-10 check items per artifact
- Each item is binary (checkable yes/no)
- Items reference specific concerns, not generic quality
- For complex artifacts, embed the prompty-evaluator's 10-point checklist
