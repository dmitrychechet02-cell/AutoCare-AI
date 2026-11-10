# Phase AUTORITM-01: Product Analytics and Visual Concept - Pattern Map

**Mapped:** 2026-11-09  
**Files analyzed:** 3 planned documentation artifacts  
**Git-tracked analogs found:** 0 / 3

## Scope and Source Gate

This is a documentation-only phase. It creates a product-wide visual and interaction contract plus two phase-local planning artifacts; it does not change `index.html`, `styles.css`, `app.js`, dependencies, runtime tracking, or storage behavior. The repository seed is presently wholly untracked (`git status --short` reports `??` for `.planning/`, `PRD.md`, `README.md`, `index.html`, `styles.css`, and `app.js`; `git ls-files --` returned no paths). Therefore no source may be presented as a git-tracked analog. The current source files below are **verified baseline integration/review points**, not copy targets or authorization for code changes.

## File Classification

| New/Modified File | Role | Data Flow | Closest Pattern Source | Match Quality |
|---|---|---|---|---|
| `DESIGN.md` | config / design contract | transform (approved decisions → reusable visual rules) | `01-UI-SPEC.md` §§Design System, states, accessibility | exact content-contract match; phase-local canonical source |
| `.planning/phases/AUTORITM-01-product-analytics-and-visual-concept/01-UX-FLOW.md` | documentation / UX-flow specification | event-driven state transition | `01-UI-SPEC.md` §§Mobile information architecture and explicit states; `PRD.md` happy path | exact content-contract match |
| `.planning/phases/AUTORITM-01-product-analytics-and-visual-concept/01-OBSERVATION-PLAN.md` | documentation / research protocol | event-driven manual observation | `01-UI-SPEC.md` §UX/usability observation plan; `01-VALIDATION.md` manual verification | exact content-contract match |

## Pattern Assignments

### `DESIGN.md` (config/design contract, transform)

**Authoritative content pattern:** phase UI contract, not a runtime stylesheet.

**Copy the document structure from:** `01-UI-SPEC.md:20-44,59-108,110-159`.

**Required sections and integration points:**

1. Define a single source of truth for design tokens, typography, component vocabulary, visible states, and accessibility. Downstream documents must link to named roles rather than repeat ungoverned values. This implements UX-04 (`.planning/REQUIREMENTS.md:27-30`) and follows the required architecture order (`01-RESEARCH.md:108-124`).
2. Record the locked roles exactly: page `#F6F8F3`, surface `#FFFFFF`, ink `#173D33`, primary `#1D4938`, accent `#43A979`, soft accent `#B5E6C9`, and danger `#B42318`; identify safe foreground/usage and the text-plus-icon/shape counterpart for urgency (`01-UI-SPEC.md:88-101`).
3. State the approved component contracts: 44px minimum actionable controls, 8px control radius, 16px cards, 8px system, one filled primary action, field-linked errors, and labelled destructive actions (`01-UI-SPEC.md:35-44,59-73`).
4. Make the five state families explicit: empty, ready/default, saved/success, validation error, and due/overdue. Preserve the approved Russian copy and the manual-deadline provenance note (`01-UI-SPEC.md:110-132`).
5. Put future implementation constraints—not an implementation patch—in a baseline-gap table: current CSS is a one-line, un-tokenised baseline with the current pine/mint palette, `.card`, `.fields`, `.stack`, `.item`, `.total`, and mobile breakpoint (`styles.css:1`); the eventual CSS entry point is `:root` (`01-CONTEXT.md:99-102`).

**Baseline review excerpts (not an implementation instruction):**

```text
styles.css:1
:root{font-family:Arial,sans-serif;color:#182b23;background:#f6f8f3}
...
.card{...border-radius:15px...}
...
@media(max-width:750px){... .grid{grid-template-columns:1fr} ...}
```

```text
index.html:6-8
<article class="card"> ... <form id="car-form" class="fields"> ...
<article class="card"> ... <form id="task-form" class="stack"> ...
<article class="card"> ... <form id="expense-form" class="stack"> ...
```

**Planner constraints:** Do not specify CSS rewrites, a component package, icon package, router, analytics SDK, or any new product controls in this phase. `01-UI-SPEC.md:24-29` allows only semantic HTML/CSS custom properties/vanilla JS for later implementation; `01-CONTEXT.md:38-39` locks the current phase tracking-free.

---

### `.planning/phases/AUTORITM-01-product-analytics-and-visual-concept/01-UX-FLOW.md` (documentation/UX-flow specification, event-driven state transition)

**Authoritative content pattern:** a four-screen transition/state table, not routing documentation.

**Copy the document structure from:** `01-UI-SPEC.md:46-57,110-159` and use the product acceptance path in `PRD.md:59-67` as the provenance cross-check.

**Required flow format:**

```text
Entry condition → one named primary action → visible saved/error/due outcome
→ focus or anchor destination → next screen pattern
```

Include exactly these screen patterns, in this order:

1. `Автомобиль`: fields for make/model/year/mileage, local-device disclosure, primary `Сохранить автомобиль`.
2. `План обслуживания`: manually entered date and/or mileage deadline, primary `Добавить в план`.
3. `История и расходы`: title/amount/date and optional mileage, primary `Добавить запись`.
4. `Контроль`: due/next task and reason precede expenses; primary action depends on whether a task is due.

The canonical transition and focus rules are already specified at `01-UI-SPEC.md:50-57`; the future implementation may retain anchored sections and must not be documented as requiring a router (`01-UI-SPEC.md:48`). The document must map each screen against UX-01 through UX-03 (`.planning/REQUIREMENTS.md:27-29`).

**State/copy assignment:** For every relevant screen, table rows must contain empty, default/ready, success, validation error, and due/overdue handling. Use the exact approved Russian phrases and the recovery behavior from `01-UI-SPEC.md:114-132`. Require inline, field-linked errors and first-invalid-field focus (`01-UI-SPEC.md:136-142`), dedicated status feedback for save/delete (`01-UI-SPEC.md:144-150`), and text + icon/shape for urgent status (`01-UI-SPEC.md:101,123-126`).

**Baseline review excerpts (not an implementation instruction):**

```javascript
app.js:13-17
$('#car-summary').textContent = car ? `Сохранено: ...` : '';
...
if (!state.tasks.length) tasks.append(text('small', 'Пока нет запланированных работ.', 'message'));
...
remaining <= 0 ? 'срок по пробегу наступил' : `через ${number(remaining)} км`
```

```html
index.html:6
<p id="car-summary" class="message" aria-live="polite"></p>
```

**Planner constraints:** Treat existing `alert(...)` failure paths as a documented gap, never as the desired interaction: `app.js:9,21-24` uses blocking alerts, while the approved contract prohibits them (`01-UI-SPEC.md:110-112,193-200`). Keep status provenance truthful: a deadline is manually entered and users must check the vehicle manual (`01-UI-SPEC.md:132`; `README.md:22`). Do not add multi-car, accounts, sync, VIN, OCR/AI, fuel, market value, notifications, or marketplace UI (`01-UI-SPEC.md:193-201`).

---

### `.planning/phases/AUTORITM-01-product-analytics-and-visual-concept/01-OBSERVATION-PLAN.md` (documentation/research protocol, event-driven manual observation)

**Authoritative content pattern:** consent-first, blank manual observation/event sheet; it is not product telemetry or a results report.

**Copy the document structure from:** `01-UI-SPEC.md:203-215` and validation controls in `01-VALIDATION.md:24-29,48-56`.

**Required sections:**

1. Purpose, participant profile (5–7 Russian private car owners), consent before notes/recording, no third-party tracker, and reset browser storage between people (`01-UI-SPEC.md:203-205`).
2. The five approved tasks: save car + explain storage; create a date/mileage plan + explain manual provenance; explain an overdue state + choose next action; add expense + find total/latest item; deliberate delete/cancel/confirm (`01-UI-SPEC.md:207-213`).
3. A blank event/observation dictionary with event name, task trigger, observable evidence, allowed fields, and blank outcome. Use a participant code—not a name—and only device/browser, task order, completion/help, time, misread label, quoted explanation, and design issue (`01-UI-SPEC.md:215`).
4. Review cadence: review after every two sessions; only then write an evidence-backed iteration backlog without expanding v1 scope (`01-UI-SPEC.md:215`).

**Canonical blank-row pattern:**

```markdown
| Event | Task trigger | Evidence to record | Outcome |
|---|---|---|---|
| `vehicle_save_attempt` | Participant submits `Автомобиль` | completion/help; elapsed time; storage-boundary explanation | blank until session |
| `maintenance_due_explained` | Participant sees a due card | date/mileage/both explanation; selected next action | blank until session |
| `expense_total_checked` | Participant saves expense | latest-entry and total comprehension | blank until session |
```

Source: `01-RESEARCH.md:207-215`.

**Baseline review points:** Current application data is browser-local under `autoritm-v1` (`app.js:2,7-9`); `README.md:7` warns that data belongs to the current browser/device and may be cleared. The observation plan must test comprehension of that boundary but must not introduce an identifier, data export, remote collection, or background analytics.

**Planner constraints:** Do not state any completion rate, time, satisfaction result, or KPI as achieved. All outcome cells stay blank until a consented session; summaries later contain only observed counts and anonymised quotes (`01-UI-SPEC.md:203-215`). This is required by D-10/D-11 (`01-CONTEXT.md:38-39`) and the validation sign-off (`01-VALIDATION.md:56,63-65`).

## Shared Patterns

### Documentation dependency order

**Source:** `01-RESEARCH.md:108-124,129-139`.

```text
Approved scope + UI contract + current static UI
  → DESIGN.md
  → 01-UX-FLOW.md and 01-OBSERVATION-PLAN.md
  → manual review against UX-01..UX-04
```

`DESIGN.md` owns reusable tokens/components/accessibility; the two phase artifacts link to it instead of duplicating changing visual values.

### Truthful local-only boundary

**Sources:** `README.md:7,22`; `index.html:3,7,9`; `01-UI-SPEC.md:18,205`.

The phrase that data is local to the browser/device is required contextual copy. Documentation must not imply cloud persistence, verified schedules, source-backed valuation, or automated advice.

### Manual validation instead of automated/runtime work

**Source:** `01-VALIDATION.md:14-29,41-56`.

All Phase 1 checks are document review and manual concept walkthroughs. The planner must create the three artifacts and validate their cross-references; it must not install a test framework or invent an executable test command.

## No Git-Tracked Analog Found

| File | Role | Data Flow | Reason / Planner response |
|---|---|---|---|
| `DESIGN.md` | config / design contract | transform | No tracked file exists in the seed. Use the phase-local UI contract as authoritative content and cite baseline files only as review points. |
| `01-UX-FLOW.md` | documentation / UX-flow specification | event-driven | No tracked documentation analog exists. Follow the canonical four-screen/state tables in `01-UI-SPEC.md`; do not derive behavior from current alerts. |
| `01-OBSERVATION-PLAN.md` | documentation / research protocol | event-driven | No tracked research-protocol analog exists. Use the approved observation rows; outcomes remain blank and consented. |

## Metadata

**Analog search scope:** repository root and Phase AUTORITM-01 documents  
**Files scanned:** 10 required inputs plus repository status/tracked-source checks  
**Pattern extraction date:** 2026-11-09  
**Tracked-source check:** `git ls-files --` yielded no source paths; no analog is represented as tracked.
