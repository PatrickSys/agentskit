# Tactical Techniques (Selected by Problem Type)

Select techniques based on task characteristics identified in Step 1.
Most artifacts combine 2-4 techniques. XML Structure [S1] is applied to
nearly all multi-section artifacts.

---

## Selection Matrix

| Task Characteristic | Primary Technique | Often Combined With |
|---|---|---|
| Reasoning, multi-step logic | Chain-of-Thought [S12] | Reasoning effort hints [S1, S2] |
| Tool usage, agentic loops | ReAct [S13] | Extended loop [S8], self-refine [S14] |
| Iterative improvement | Self-Refine [S14] | Quality check [S2] |
| Complex multi-section content | XML Semantic Structure [S1] | Progressive disclosure [S15] |
| Context-heavy, long-horizon | Progressive Disclosure [S4, S15] | JIT loading [S4] |
| Behavioral guidance needed | Few-Shot Examples [S1] | XML for examples [S1] |
| Multi-file context workflows | JIT Context Loading [S4] | Extraction guidance [S4] |
| Compliance-critical gates | Authority Language Calibration [S1] | Scope boundaries [GSD] |
| Prompt generating prompts | Meta-Prompting [S2] | Self-refine [S14] |
| Formal scope definition | Contracts as Interface [S19] | Output contracts [S2] |

---

## Technique Details

### 1. Chain-of-Thought (CoT)

**Source**: Wei et al. 2022 [S12], updated with reasoning effort tuning [S1, S2]
**When**: The task requires multi-step reasoning, math, logic, planning, or
complex decision-making.
**How**: Add structured reasoning guidance to the generated artifact. For 2026
frontier models, use platform-specific reasoning hints rather than generic
"think step-by-step":
- Claude: `think` / `ultrathink` keywords [S1]
- GPT-5.4: `reasoning_effort` parameter (low/medium/high) [S2]
- General: explicit reasoning sections in the algorithm

**Example in generated artifact**:
```
Step 3: Analyze the requirements
  Think through each requirement and identify:
  - Dependencies between requirements
  - Potential conflicts or ambiguities
  - Implementation complexity (simple/moderate/complex)
  Document your reasoning before proceeding to design.
```

---

### 2. ReAct (Reasoning + Acting)

**Source**: Yao et al. 2022 [S13], extended in Harness Engineering [S8, S24]
**When**: The agent uses external tools (search, file read, API calls) and must
interleave reasoning with tool calls.
**How**: Structure the algorithm as thought-action-observation loops. Each step
has a reasoning phase ("what do I need?"), an action phase ("use tool X"),
and an observation phase ("what did I learn?").

**Example in generated artifact**:
```
Step 2: Research the topic
  2a. Identify what you need to know (reasoning)
  2b. Search for relevant sources using web search (action)
  2c. Read and evaluate each source for relevance and credibility (observation)
  2d. If gaps remain, refine search terms and repeat (loop)
  Continue until you have 3+ credible sources covering the topic.
```

**Extended pattern** [S8]: For complex agentic workflows, add explicit reasoning
phases between tool calls: "Before calling the next tool, assess whether the
current information is sufficient to proceed."

---

### 3. Self-Refine

**Source**: Madaan et al. NeurIPS 2023 [S14], validated in GSD plan-checker
**When**: Output quality benefits from iterative improvement. Code generation,
writing tasks, plan creation.
**How**: Generate -> critique -> refine loops. Cap at 3 cycles to prevent
infinite refinement [GSD plan-checker].

**Example in generated artifact**:
```
Step 5: Generate initial draft
Step 6: Self-critique the draft
  - Does it meet all requirements from Step 1?
  - Are there gaps in coverage?
  - Is the structure clear and consistent?
Step 7: Refine based on critique (max 2 additional cycles)
  If critique identifies issues, revise and re-critique.
  Stop after 3 total cycles or when no significant issues remain.
```

---

### 4. XML Semantic Structure

**Source**: Anthropic [S1] (XML tags for Claude), GSD all role contracts
**When**: The artifact has multiple sections, roles, or concerns that benefit
from explicit structural separation. Nearly always applied for role contracts
and SKILL.md files.
**How**: Use semantic XML tags to separate sections. Standard tags:
`<role>`, `<anti_patterns>`, `<input_contract>`, `<output_contract>`,
`<algorithm>`, `<examples>`, `<quality_check>`

**When NOT to use**: Very simple system prompts (< 30 lines) where plain text
with section headers suffices.

---

### 5. Progressive Disclosure

**Source**: Anthropic CE [S4], agentskills.io [S15]
**When**: The artifact contains more information than fits in a single file
without exceeding recommended limits (~500 lines for SKILL.md [S15]).
**How**: Three-tier model:
- **Tier 1 (Discovery)**: ~100 tokens -- name + description in YAML frontmatter.
  Loaded at startup for all skills.
- **Tier 2 (Instruction)**: < 5000 tokens -- SKILL.md body. Loaded when skill
  is activated.
- **Tier 3 (Reference)**: As-needed -- files in references/ directory. Loaded
  only when the skill needs detailed rubrics, examples, or specifications.

**Example in generated SKILL.md**:
```
Step 4: Select tactical techniques
  Load selection matrix from references/techniques.md
  (Why: the full matrix is 150+ lines; keeping it in references/
  reduces the body to essential algorithm steps.)
```

---

### 6. Few-Shot Examples

**Source**: Anthropic [S1] -- 3+ diverse examples in `<example>` tags
**When**: The artifact guides complex interactions where format and behavioral
expectations need demonstration, not just description.
**How**: Include 3+ examples showing diverse scenarios:
- Example 1: Simple/common case (happy path)
- Example 2: Complex case with multiple concerns
- Example 3: Edge case, error recovery, or unusual input

Each example shows COMPLETE input AND expected output. Use `<example>` XML tags.

---

### 7. JIT Context Loading

**Source**: Anthropic CE [S4] (JIT loading, "lightweight identifiers first"),
GSD approach-explorer (extraction guidance)
**When**: The agent needs to read external files but should not load everything
into context at once.
**How**: Reference files by path with extraction guidance specifying exactly
what to read. Load at the point of need, not upfront.

**Example**:
```xml
<input_contract>
From SPEC.md: read ONLY locked decisions and deferred items
(skip project description, requirements prose, historical context).
From existing code: read function signatures and public API
(skip implementation details unless debugging).
</input_contract>
```

---

### 8. Authority Language Calibration

**Source**: Anthropic [S1] (CRITICAL overtrigger warning),
GSD LL-AUTHORITY-LANGUAGE-IS-CONTEXTUAL
**When**: The generated artifact has compliance-critical gates that MUST be
followed (security boundaries, mandatory reads, never-skip checks).
**How**: Use CRITICAL/NEVER only for mandatory gates. Use normal imperative
language ("Use X", "Apply Y") for all other instructions.

**Rule of thumb**: One CRITICAL per artifact (the mandatory initial-read gate).
Zero CRITICAL in algorithm steps. If everything is critical, nothing is.

---

### 9. Meta-Prompting

**Source**: OpenAI Cookbook, prompt engineering literature
**When**: The generated artifact is itself a prompt that generates or optimizes
other prompts (meta-level).
**How**: Include explicit instructions for the meta-level: "You are generating
a prompt. The prompt you generate should follow these patterns..."

---

### 10. Contracts as Interface

**Source**: Practitioner perspective [S19]
**When**: The artifact needs formal scope definition with explicit ask/refuse
rules, evidence policy, or tool-proposal interface.
**How**: Structure the artifact as a contract with:
- Scope: what it will and won't do
- Output schema: exact deliverables
- Ask/refuse rules: when to ask for clarification vs. when to refuse
- Evidence policy: how claims should be backed
