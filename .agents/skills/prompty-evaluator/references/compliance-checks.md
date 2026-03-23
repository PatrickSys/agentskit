# SOTA Compliance Checks

Each check has: what to look for, pass/fail criteria, primary source, and fix.
Apply checks selectively by artifact type (see SKILL.md Step 2 matrix).

---

## 1. Authority Language Audit

**Source**: Anthropic [S1] (CRITICAL overtrigger warning), GSD LL-AUTHORITY-LANGUAGE-IS-CONTEXTUAL
**What to look for**: Usage of CRITICAL, NEVER, MUST, ALWAYS in the artifact
**Pass**: CRITICAL/NEVER used only for mandatory initial-read gates or security boundaries. Normal imperative language ("do X", "use Y") for algorithm steps and general guidance.
**Fail**: CRITICAL/NEVER used for routine instructions, algorithm steps, or general preferences.
**Why it matters**: Anthropic warns that overuse of CRITICAL overtriggers on Claude 4.6, causing the model to fixate on those instructions at the expense of others [S1]. Reserve emphasis for gates.
**Fix**: Replace `CRITICAL: Always use XML tags` with `Use XML tags for prompt structure.` Reserve CRITICAL for the mandatory initial-read block only.

---

## 2. Positive Instructions

**Source**: Anthropic [S1] -- "tell what to do, not what not to do"
**What to look for**: Algorithm/instruction sections that rely primarily on negative instructions
**Pass**: Anti-patterns section exists separately. Algorithm steps use positive language ("Use X", "Apply Y", "Generate Z").
**Fail**: Algorithm steps dominated by "Don't X", "Never Y", "Avoid Z" without a separate anti-patterns section.
**Why it matters**: Models follow positive instructions more reliably than prohibitions [S1]. Separating "what not to do" into an anti-patterns section lets the algorithm be constructive.
**Fix**: Move negative instructions to a dedicated `<anti_patterns>` section. Rewrite algorithm steps as positive directives.

---

## 3. Long-Context Placement

**Source**: Anthropic [S1] -- docs TOP, query BOTTOM
**What to look for**: Where reference material vs. task-specific instructions are placed
**Pass**: Static reference material (role, anti-patterns, examples, contracts) placed at the top. Variable content (user query, task-specific parameters) at the bottom.
**Fail**: User query or variable content placed at the top with reference material at the bottom.
**Why it matters**: Models attend most strongly to the beginning and end of context [S1]. Placing static content first also maximizes KV-cache hit rates [S5, S26].
**Fix**: Reorganize: role -> anti-patterns -> contracts -> algorithm -> examples -> (user input at invocation time).

---

## 4. Few-Shot Examples

**Source**: Anthropic [S1] -- 3+ diverse examples in `<example>` tags
**What to look for**: Presence and quality of examples for complex tasks
**Pass**: 3+ examples showing diverse scenarios (not just happy path). Examples use `<example>` XML tags. Each shows input AND expected output.
**Fail**: No examples, or only 1-2 examples, or examples that only show the happy path.
**Skip if**: Simple prompt with straightforward output (no behavioral guidance needed).
**Why it matters**: Few-shot examples are the most reliable way to guide model behavior for complex interactions [S1]. Diverse examples prevent overfitting to one pattern.
**Fix**: Add 3 examples: one simple case, one complex case, one edge case. Show complete input-output pairs.

---

## 5. Scope Boundaries

**Source**: GSD role contracts, SPEC.md D5
**What to look for**: Explicit in-scope and out-of-scope declarations
**Pass**: Clear in-scope list, out-of-scope list, and judgment heuristics for grey areas. Agent knows what to refuse.
**Fail**: No scope boundaries, or only in-scope without out-of-scope, or no guidance for edge cases.
**Why it matters**: Without scope boundaries, agents attempt tasks they shouldn't, producing low-quality output on out-of-scope requests [GSD LL-SYSTEMIC-ROLE-FLATTENING].
**Fix**: Add scope section with three parts: "In scope: ...", "Out of scope: ...", "Judgment call: when in doubt, [heuristic]."

---

## 6. Anti-Patterns (Early Placement)

**Source**: Anthropic [S1], GSD all role contracts
**What to look for**: A dedicated section documenting what NOT to do, placed early
**Pass**: Anti-patterns section exists after role definition and before algorithm. Contains specific, actionable "don't do this" items.
**Fail**: No anti-patterns section, or anti-patterns buried at the end, or only generic warnings.
**Why it matters**: Early placement ensures high attention weight [S1]. Specific anti-patterns prevent the most common failure modes. GSD production experience shows anti-patterns placed after the role definition catch issues before the agent begins its algorithm.
**Fix**: Add `<anti_patterns>` section immediately after `<role>`. List 4-7 specific failure modes with brief explanation of why each matters.

---

## 7. Self-Check / Verification Loop

**Source**: OpenAI [S2] (verification loops), Self-Refine [S14] (generate-critique-refine)
**What to look for**: Explicit verification step before final output
**Pass**: The artifact includes a self-check, quality gate, or verification loop as the final step before output. Check items are specific and checkable (not "verify quality").
**Fail**: No verification step, or verification is generic ("make sure it's good").
**Why it matters**: Self-Refine [S14] demonstrates that explicit critique-refine loops improve output quality. OpenAI [S2] codifies verification loops as a best practice. GSD's plan-checker validates this with max-3-cycle loops.
**Fix**: Add `<quality_check>` section with 5-10 specific, binary (yes/no) check items. Example: "Does the output have a clear role definition? [yes/no]"

---

## 8. Output Contracts

**Source**: OpenAI [S2] (completeness contracts, format locking), practitioner perspective on contracts-as-interface [S19]
**What to look for**: Explicit specification of what the artifact produces
**Pass**: `<output_contract>` or equivalent section specifying: numbered deliverables, format for each, constraints (length, required fields, schema).
**Fail**: No output specification, or vague output description ("provide feedback").
**Why it matters**: Without output contracts, every invocation produces differently-structured output, making downstream processing unreliable [S2]. Format locking prevents format drift [S2].
**Fix**: Add `<output_contract>` section. List numbered deliverables with format specification for each.

---

## 9. Input Contracts with Extraction Guidance

**Source**: Anthropic CE [S4] (JIT context loading), GSD approach-explorer
**What to look for**: Specification of what the artifact expects as input, with guidance on what to extract from referenced files
**Pass**: `<input_contract>` specifying what the user provides. If files are referenced, extraction guidance states what to read from each ("From SPEC.md: locked decisions ONLY, skip project description").
**Fail**: No input specification, or file references without extraction guidance (causing full-file reads that bloat context).
**Why it matters**: Without extraction guidance, agents load entire files when only specific sections matter, wasting context window and increasing context rot [S4].
**Fix**: Add `<input_contract>` section. For each referenced file, specify exactly what to extract.

---

## Context Engineering Checks (Applied to SKILL.md and Multi-Agent Artifacts)

### CE1. Token Budget Awareness
**Source**: Anthropic CE [S4], Manus [S5]
**Pass**: Artifact size is appropriate for its purpose. SKILL.md body under recommended 500 lines [S15]. Token estimates provided where relevant.
**Fail**: Artifact is oversized for its purpose, or no awareness of context budget.

### CE2. Progressive Disclosure
**Source**: Anthropic CE [S4], agentskills.io [S15]
**Pass**: SKILL.md body contains algorithm and key guidance. Detailed rubrics, examples, and reference material in references/ directory. Agent loads references on demand.
**Fail**: Everything packed into one file, or references/ exist but aren't referenced from the body.

### CE3. Sub-Agent Return Sizes
**Source**: GSD LL-SUBAGENT-RETURN-SIZE-MATTERS, Anthropic CE [S4]
**Pass**: If the artifact involves sub-agents, return budgets are specified by downstream use (routing: 100-200, human: 300-500, agent: 500-800, handoff: 1000-2000 tokens).
**Fail**: Sub-agents mentioned but no return budget guidance.

### CE4. Caching-Friendly Structure
**Source**: Manus [S5], Prompt Caching [S26]
**Pass**: Static content (role, anti-patterns, contracts, algorithm) placed first. Variable content (user input, task parameters) at the end. Deterministic serialization of structured content.
**Fail**: Variable content mixed into static sections, or dynamic content at the start breaking prefix cache.
