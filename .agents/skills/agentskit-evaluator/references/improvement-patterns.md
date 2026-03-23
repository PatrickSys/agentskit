# Common Improvement Patterns

Frequent issues found during prompt evaluation, organized by impact.
Each pattern includes the symptom, root cause, fix, and before/after example.

---

## High Impact (Lifts score 2+ points)

### Missing Output Contract

**Symptom**: Specificity score below 5. Output varies wildly between invocations.
**Root cause**: No explicit specification of what the prompt produces.
**Source**: OpenAI [S2] output contracts, format locking
**Fix**: Add `<output_contract>` section with numbered deliverables and format specs.

Before:
```
Review the code and provide feedback.
```

After:
```xml
<output_contract>
You produce:
1. Issue list: severity (critical/warning/info), file, line, description
2. Summary: 2-3 sentences on overall code quality
3. Suggested fixes: code blocks with before/after for each critical issue
</output_contract>
```

---

### Missing Scope Boundaries

**Symptom**: Agent attempts tasks outside its expertise. Inconsistent refusals.
**Root cause**: No in-scope / out-of-scope declaration.
**Source**: GSD role contracts
**Fix**: Add explicit scope with in/out/judgment heuristics.

Before:
```
You are a code reviewer. Review code for quality.
```

After:
```
In scope: bugs, security vulnerabilities, error handling gaps, logic errors.
Out of scope: style preferences, naming conventions, performance optimization
(unless it causes correctness issues).
Judgment call: if a pattern is technically correct but fragile, flag it as
a warning, not a critical issue.
```

---

### No Verification Loop

**Symptom**: Completeness score below 6. Outputs have preventable errors.
**Root cause**: No self-check step before delivering output.
**Source**: OpenAI [S2] verification loops, Self-Refine [S14]
**Fix**: Add `<quality_check>` with specific, binary check items.

Before:
```
(algorithm ends with "Generate the output")
```

After:
```xml
<quality_check>
Before delivering, verify:
1. Every critical issue has a suggested fix
2. No false positives from standard library patterns
3. Severity ratings are internally consistent
4. Summary accurately reflects the issue list
5. Code examples compile/parse correctly
</quality_check>
```

---

## Medium Impact (Lifts score 1-2 points)

### Authority Language Overuse

**Symptom**: Multiple CRITICAL/NEVER/MUST in algorithm steps. Model fixates on
emphasized instructions at expense of others.
**Root cause**: Using emphasis language for all important instructions instead of
reserving it for gates.
**Source**: Anthropic [S1] CRITICAL overtrigger warning, GSD LL-AUTHORITY-LANGUAGE-IS-CONTEXTUAL
**Fix**: Replace CRITICAL with normal imperative language in algorithm steps.
Keep one CRITICAL for mandatory initial-read gate if needed.

Before:
```
CRITICAL: Always use XML tags for structure.
NEVER output plain text for multi-section prompts.
MUST include examples for every complex task.
```

After:
```
Use XML tags for multi-section prompt structure. [S1]
Include 3+ examples for complex interaction patterns. [S1]
```

---

### Anti-Patterns Missing or Misplaced

**Symptom**: Agent makes predictable errors that could have been prevented.
**Root cause**: No anti-patterns section, or anti-patterns buried at end.
**Source**: Anthropic [S1], GSD role contracts
**Fix**: Add `<anti_patterns>` immediately after `<role>`, with 4-7 specific items.

Before:
```xml
<role>You are a researcher.</role>
<algorithm>Step 1: Search...</algorithm>
<!-- anti-patterns at end, low attention weight -->
<notes>Don't make stuff up. Don't skip citations.</notes>
```

After:
```xml
<role>You are a researcher.</role>
<anti_patterns>
- Do not assert facts without a source citation -- every claim needs a reference
- Do not rely on training data for current facts -- use search tools to verify
- Do not include sources you haven't actually read -- cite only verified URLs
- Do not produce a wall of text -- use structured sections with headers
</anti_patterns>
<algorithm>Step 1: Search...</algorithm>
```

---

### Negative-Only Instructions

**Symptom**: Algorithm reads as a list of prohibitions. Agent doesn't know what TO do.
**Root cause**: Mixing "what not to do" with "what to do" in the same section.
**Source**: Anthropic [S1] -- "tell what to do, not what not to do"
**Fix**: Move prohibitions to `<anti_patterns>`. Rewrite algorithm as positive directives.

Before:
```
Don't use markdown headers for complex structure.
Don't skip the verification step.
Don't generate without checking scope first.
```

After:
```
Use XML tags for complex multi-section structure. [S1]
Run the verification checklist before delivering output. [S2, S14]
Check scope boundaries before generating -- refuse out-of-scope requests. [GSD]
```

---

## Lower Impact (Refinement)

### Context Ordering Issues

**Symptom**: Context Design score below 7. Model misses important instructions.
**Root cause**: Critical information placed in low-attention positions.
**Source**: Anthropic [S1] long-context placement, Prompt Caching [S26]
**Fix**: Reorder: static reference material (role, contracts, algorithm) at top,
variable content (user input) at bottom.

---

### Missing Few-Shot Examples

**Symptom**: Output format inconsistent across invocations. Agent misinterprets
expected behavior.
**Root cause**: No examples showing expected input-output patterns.
**Source**: Anthropic [S1] -- 3+ diverse examples
**Fix**: Add 3 examples in `<example>` tags: simple case, complex case, edge case.
Each shows complete input AND expected output.

---

### SKILL.md Frontmatter Issues

**Symptom**: Skill not discovered by agent platforms, or incorrect metadata.
**Root cause**: Missing required fields, or using non-standard optional fields.
**Source**: agentskills.io [S15]
**Fix**: Use only `name` (required), `description` (required), and `license` (optional).
Real Anthropic skills use only these three fields. The `compatibility` field is
for environment requirements (e.g., "Requires Python 3.14+"), not platform listing.
The `allowed-tools` field is experimental and may not be supported across platforms.
