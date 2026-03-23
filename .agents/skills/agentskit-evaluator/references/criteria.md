# Quality Dimension Rubrics

Detailed scoring rubrics for the 5 quality dimensions. Each dimension is scored
1-10 using these descriptors. Apply rubrics relative to the artifact's complexity
-- a simple prompt is held to simpler standards than a full role contract [S4].

---

## 1. Clarity (1-10)

**What it measures**: Would a colleague (human or AI) understand the task without
asking clarifying questions? [S1]

| Score | Descriptor | Indicators |
|---|---|---|
| 1-3 | **Ambiguous** | Multiple interpretations possible. Purpose unclear. Key terms undefined. Contradictory instructions ("thorough but concise"). |
| 4-6 | **Mostly clear** | Purpose clear but some instructions open to interpretation. Minor ambiguities in edge cases. Reader could proceed but might make wrong assumptions. |
| 7-8 | **Clear** | Unambiguous purpose and instructions. Minor edge cases unclear but core behavior well-defined. A competent agent would produce consistent output. |
| 9-10 | **Crystal clear** | Every instruction is unambiguous. Edge cases addressed. Judgment calls have heuristics. Two agents given this prompt would produce near-identical outputs. |

**Common deductions**:
- Contradictory instructions (e.g., "be brief but thorough") [-2]
- Undefined key terms (e.g., "high quality" without criteria) [-1]
- Missing context for who the audience is [-1]

---

## 2. Specificity (1-10)

**What it measures**: Are constraints, format, scope, and output contracts explicit?
Or is the output left to interpretation? [S2 output contracts, S19 contracts-as-interface]

| Score | Descriptor | Indicators |
|---|---|---|
| 1-3 | **Vague** | No output format specified. No constraints. "Do your best" energy. Output would vary wildly between invocations. |
| 4-6 | **Partially specified** | Some output guidance but key aspects left open. Format mentioned but not locked. Constraints implied but not explicit. |
| 7-8 | **Well-specified** | Output format defined. Key constraints explicit. Scope boundaries present. An agent knows what "done" looks like. |
| 9-10 | **Fully contracted** | Complete output contract with format, schema, constraints, and examples. Scope boundaries with in/out/judgment heuristics. Nothing left to interpretation. |

**Common deductions**:
- No output contract [-3]
- Output format mentioned but not locked (e.g., "provide a summary" without structure) [-1]
- No scope boundaries [-2]
- Missing constraints (length, format, what to include/exclude) [-1]

---

## 3. Context Design (1-10)

**What it measures**: Is context well-structured? Is the altitude calibrated
(not too rigid for edge cases, not too vague to be useful)? Is information
ordered effectively for model attention? [S4 altitude calibration, S1 placement]

| Score | Descriptor | Indicators |
|---|---|---|
| 1-3 | **Poor context** | No structure. Critical information buried. Wrong altitude (too rigid OR too vague). Context would confuse more than help. |
| 4-6 | **Adequate** | Some structure. Important information reasonably placed. Altitude mostly appropriate. Could benefit from reorganization. |
| 7-8 | **Well-designed** | Clear information hierarchy. Critical context placed for attention (docs TOP, query BOTTOM [S1]). Altitude calibrated for the task. |
| 9-10 | **Excellent** | Information architecture optimized. Progressive disclosure where appropriate [S15]. Static content first for caching [S26]. Context volume matched to task complexity. |

**Common deductions**:
- Critical information buried at the end [-2]
- Overloaded context (everything included, nothing prioritized) [-2]
- Wrong altitude: too rigid (breaks on variants) or too vague (no guidance) [-2]
- No information hierarchy [-1]

---

## 4. Completeness (1-10)

**What it measures**: Are all aspects of the task covered? Verification loops
present? Recovery paths for edge cases? [S2 completeness contracts, S14 self-refine]

| Score | Descriptor | Indicators |
|---|---|---|
| 1-3 | **Incomplete** | Major aspects missing. No verification. No edge case handling. Would fail on common variations. |
| 4-6 | **Partially complete** | Core task covered but important aspects missing. No self-check. Edge cases unaddressed. Would work for happy path only. |
| 7-8 | **Complete** | All major aspects covered. Self-check present. Common edge cases addressed. Handles typical variations. |
| 9-10 | **Comprehensive** | Full coverage including edge cases. Verification loop with specific checks [S14]. Recovery paths for failures. Anti-patterns document known pitfalls. |

**Common deductions**:
- No self-check / verification loop [-3]
- No edge case handling [-2]
- Missing anti-patterns section [-1]
- No recovery path for common failures [-1]

---

## 5. Structure (1-10)

**What it measures**: Are XML tags, sections, progressive disclosure, and formatting
used appropriately for the artifact's complexity? [S1 XML tags, S15 progressive disclosure]

| Score | Descriptor | Indicators |
|---|---|---|
| 1-3 | **Unstructured** | Wall of text. No sections. No formatting. Hard to parse for both humans and models. |
| 4-6 | **Basic structure** | Has sections/headers. Some formatting. But structure doesn't match the content's complexity. |
| 7-8 | **Well-structured** | Appropriate use of sections. XML tags for complex artifacts [S1]. Tables for structured data. Progressive disclosure for heavy content. |
| 9-10 | **Optimally structured** | XML semantic structure for multi-section artifacts. Progressive disclosure with references/ [S15]. Caching-friendly ordering (static first) [S26]. Anti-patterns placed after role [S1]. |

**Common deductions**:
- Complex multi-section artifact using plain text instead of XML [-3]
- No progressive disclosure for 500+ line artifacts [-2]
- Anti-patterns placed at the end instead of early [-1]
- Information repeated instead of structured [-1]

---

## Score Interpretation

| Composite Score | Assessment | Action |
|---|---|---|
| 1-3 | Needs fundamental rework | Rewrite from scratch using structural principles |
| 4-5 | Below standard | Major structural additions needed (contracts, scope, self-check) |
| 6-7 | Acceptable | Specific improvements will lift quality significantly |
| 8-9 | Strong | Minor refinements only |
| 10 | Exemplary | Reference-quality artifact |
