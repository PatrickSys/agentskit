# Output Format Specifications

Templates and guidelines for each output type the architect can generate.

---

## 1. System Prompt

**When**: Simple agent instructions, single purpose, no complex tool interactions.
**Size**: 50-200 lines typical.
**Structure**: Sections with clear headers. XML optional (use for multi-concern prompts).

**Template**:
```
You are [role]. You [purpose].

[Scope section -- inline or separate]
In scope: [list]
Out of scope: [list]

[Instructions -- positive directives]
[Step 1]
[Step 2]
...

[Output specification]
You produce:
1. [deliverable with format]
2. [deliverable with format]

[Self-check -- if task is non-trivial]
Before delivering, verify:
- [check 1]
- [check 2]
```

**Notes**:
- No YAML frontmatter
- No `<anti_patterns>` XML unless there are 4+ failure modes to document
- Keep it concise -- a system prompt that needs 300+ lines should probably
  be a role contract

---

## 2. SKILL.md (agentskills.io Standard)

**When**: Multi-platform skill, needs progressive disclosure, references/ for detail.
**Size**: Body < 500 lines recommended [S15] (official Anthropic skills sometimes exceed this -- it's guidance, not law).
**Structure**: YAML frontmatter + XML-structured body + references/ directory.

**Frontmatter** (minimal -- real Anthropic skills use only these fields):
```yaml
---
name: skill-name
description: >
  One-line description of what the skill does and when to use it.
  Max 1024 characters. This is loaded at startup (~100 tokens) for
  relevance matching, so make it specific.
license: MIT
---
```

**Field notes**:
- `name`: lowercase, hyphens, 1-64 chars, matches directory name
- `description`: "what" + "when to use" format. This is the discovery text.
- `license`: short form (MIT, Apache-2.0, or "Complete terms in LICENSE.txt")
- `compatibility`: OPTIONAL. For environment requirements ("Requires Python 3.14+"),
  NOT platform listing. Omit if no special requirements.
- `allowed-tools`: EXPERIMENTAL in agentskills.io spec. Support varies by platform.
  Omit from SKILL.md; use in vendor-specific adapters (.claude/commands/) only.

**Body template**:
```xml
CRITICAL: [Mandatory initial-read gate if needed]

<role>
[Purpose, identity, methodology]
</role>

<anti_patterns>
[4-7 specific failure modes]
</anti_patterns>

<input_contract>
[What the skill receives, with extraction guidance for referenced files]
</input_contract>

<output_contract>
[Numbered deliverables with format specification]
</output_contract>

<algorithm>
[Step-by-step process with citations]
</algorithm>

<examples>
[3+ diverse examples showing input and output]
</examples>

<quality_check>
[Verification checklist -- 5-10 binary check items]
</quality_check>
```

**References directory**:
```
references/
  |- detailed-rubrics.md     (expanded criteria, examples)
  |- selection-logic.md      (decision trees, matrices)
  |- templates.md            (format templates, schemas)
```

---

## 3. Role Contract

**When**: Full behavioral spec for complex agent with multi-step workflows,
tool usage, and nuanced scope.
**Size**: 100-400 lines.
**Structure**: Full XML semantic structure with all sections.

**Template**:
```xml
<role>
You are [role name] -- [one-line purpose].

[2-3 paragraphs describing methodology, approach, and identity]
[Include WHY context for non-obvious choices]
</role>

<anti_patterns>
- [4-7 specific failure modes, each with brief why]
</anti_patterns>

<scope>
In scope: [specific list]
Out of scope: [specific list]
Judgment call: [heuristic for grey areas]
</scope>

<input_contract>
You receive:
1. [input item with extraction guidance]
2. [input item with extraction guidance]

From [referenced file]: extract [specific content] ONLY
(skip [what to ignore]).
</input_contract>

<output_contract>
You produce:
1. [deliverable]: [format, constraints]
2. [deliverable]: [format, constraints]
</output_contract>

<algorithm>
Step 1: [action with reasoning]
  [Sub-steps if complex]
  (Why: [context for non-obvious steps])

Step 2: [action]
  ...

Step N: Self-check
  [Run verification checklist]
</algorithm>

<examples>
<example>
<scenario>[Description]</scenario>
<input>[Complete input]</input>
<output>[Complete expected output]</output>
</example>
(3+ examples)
</examples>

<quality_check>
Before delivering, verify:
1. [specific check] [yes/no]
2. [specific check] [yes/no]
...
</quality_check>
```

**Notes**:
- No YAML frontmatter (role contracts are not agentskills.io format)
- All XML sections are required for role contracts
- Include WHY context for any non-obvious instruction [S1, GSD]
- Match depth to the agent's actual complexity

---

## 4. AGENTS.md Section

**When**: Repo-level governance entry for an existing project.
**Size**: 30-100 lines.
**Structure**: Markdown with governance-appropriate structure.

**Template**:
```markdown
## [Agent/Role Name]

**Purpose**: [One-line description]
**Invocation**: [How to trigger -- slash command, file path, etc.]

### Rules
- [Rule 1]
- [Rule 2]

### Workflow
1. [Step 1]
2. [Step 2]

### Constraints
- [Constraint 1]
- [Constraint 2]
```

**Notes**:
- Follow existing AGENTS.md conventions in the repo
- Keep it concise -- AGENTS.md is governance, not the full spec
- Reference the full skill/contract for detailed behavior
