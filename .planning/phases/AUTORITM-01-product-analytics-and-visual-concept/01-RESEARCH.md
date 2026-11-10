# Phase AUTORITM-01: Product Analytics and Visual Concept — Research

**Researched:** 2026-11-09  
**Domain:** Documentation-first mobile UX contract, visual system, and privacy-respecting usability observation for a static HTML/CSS/JavaScript MVP  
**Confidence:** HIGH for scope and current-code facts; MEDIUM for standards-backed usability guidance

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

### Core mobile journey

- **D-01:** Design around one happy path: **add or confirm automobile → plan maintenance → record completed work/expense → review what needs attention**. Every key screen exposes one primary next action; secondary information stays visually quiet.
- **D-02:** The home/control view prioritises the next maintenance item and its reason before the total-expense summary. It is a personal service-book dashboard, not a marketplace, car catalogue or reporting console.
- **D-03:** Use one private automobile as the explicit unit of the journey. Multi-car and fleet navigation are deferred rather than represented by inactive UI.

### Visual direction and tokens

- **D-04:** Keep and formalise the existing visual personality: **calm, assured, practical digital service book**. Use dark pine for structure and confidence, light warm-green surfaces for reading, and mint only for purposeful accents; avoid automotive-racing imagery, gradients, glossy widgets and gamification.
- **D-05:** Establish role-based colour tokens, not arbitrary swatches: page `#F6F8F3`, surface `#FFFFFF`, ink `#173D33`, primary action `#1D4938`, positive/accent `#43A979` only with accessible foreground, soft accent `#B5E6C9`, and urgent/error `#B42318`. Normal/urgent maintenance must also carry explicit text and an icon/shape. — **Reversibility:** costly — these tokens will be applied across CSS components and documentation.
- **D-06:** Use a system sans-serif stack, an 8px spacing scale, a 44px minimum target for primary touch actions, 8px control radius and 16px card radius. Keep the existing responsive single-column layout under 750px as the mobile baseline.

### States, copy and accessibility

- **D-07:** Specify five visible states for each relevant screen: empty, ready/default, saved/success, validation error, and due/overdue. Error guidance is field-linked and written in plain Russian; it must replace blocking browser alerts in the future implementation.
- **D-08:** A maintenance status always says *why* it is urgent: date, mileage or both. Do not label a manually entered deadline as a factory recommendation; retain the reminder to check the vehicle manual.
- **D-09:** Define success/error announcements and focus behaviour for dynamic lists. The current `aria-live` confirmation pattern is reusable; deletion and validation behaviour need an explicit accessible pattern before UI implementation.

### Validation and lightweight analytics

- **D-10:** Validate the concept with 5–7 people matching the primary persona. The task script measures whether they can complete the happy path and explain the next due item without help; reported metrics remain observations, not invented product KPIs.
- **D-11:** Keep the prototype tracking-free in this phase. The analytics plan is a minimal event/observation specification; no third-party analytics SDK, account identifier or background data collection is added. — **Reversibility:** costly — adding tracking changes privacy expectations and needs a separate consent/data-retention decision.

### the agent's Discretion

- The exact wireframe medium, icon library and layout mechanics may vary if they preserve the approved journey, 8px system, semantic labels, non-colour urgency cue and one-action hierarchy.
- The final implementation may adjust individual supporting shades after a documented WCAG contrast check, while preserving the named colour roles and visual personality.

### Deferred Ideas (OUT OF SCOPE)

- Verified manufacturer maintenance schedules, VIN/recall history and vehicle valuation — require a licensed, auditable provider and a dedicated research phase.
- OCR/AI receipt or order parsing — requires file handling, user confirmation, provenance and security design.
- Push notifications, accounts, cloud sync, backup/export/import and multi-vehicle support — require a separate data-continuity decision and implementation phase.
- Fuel, routes, income and fleet features — do not support the current one-car service-book job.

*Verbatim upstream decisions: [VERIFIED: .planning/phases/AUTORITM-01-product-analytics-and-visual-concept/01-CONTEXT.md:20-44,114-117].*
</user_constraints>

## Phase Requirements

| ID | Description | Research Support |
|---|---|---|
| UX-01 | “Пользователь проходит основной сценарий на мобильном экране с понятным следующим действием на каждом шаге.” [VERIFIED: .planning/REQUIREMENTS.md:27] | Four screen-pattern transitions, one filled primary action, and a 320px/mobile verification rubric. |
| UX-02 | “Пользователь видит предсказуемые состояния интерфейса: пустой список, успех сохранения, ошибка ввода и наступивший срок.” [VERIFIED: .planning/REQUIREMENTS.md:28] | State matrix and Russian copy/focus contract. |
| UX-03 | “Пользователь может различить обычный и срочный статус не только по цвету, а текст и интерактивные элементы остаются читаемыми.” [VERIFIED: .planning/REQUIREMENTS.md:29] | Text + icon/shape urgency rule, WCAG contrast checks, and target-size checks. |
| UX-04 | “Все ключевые экраны используют единые роли цветов, типографику, отступы и компоненты из `DESIGN.md`.” [VERIFIED: .planning/REQUIREMENTS.md:30] | Root `DESIGN.md` with named tokens, component states, and an artifact-review checklist. |

## Summary

Phase 1 is a documentation deliverable, not a UI rewrite or analytics integration. Its plan should turn the approved `01-UI-SPEC.md` into three reviewable artifacts: a reusable root `DESIGN.md`; a concise mobile-flow/state reference; and a consent-based usability-observation/event sheet. The artifacts must describe the product concept and a method to observe it, never claim that participants completed tasks or that a metric has been achieved. [VERIFIED: .planning/phases/AUTORITM-01-product-analytics-and-visual-concept/01-CONTEXT.md:9-11,38-39; CITED: https://www.w3.org/TR/2020/WD-coga-usable-20201211/usability_testing.html]

The existing product is a dependency-free single-page prototype: its markup contains the three relevant forms and `#car-summary` uses `aria-live="polite"`; its state key is the verbatim value `"autoritm-v1"`; its current object is verbatim `"{ car: null, tasks: [], expenses: [] }"`. [VERIFIED: index.html:6-8; VERIFIED: app.js:2,7] This phase should document how the later implementation changes those screens, rather than change the source files now.

**Primary recommendation:** Plan a documentation-only sequence that first writes `DESIGN.md`, then writes flow/state and observation artifacts that reference it, and finally validates the documents against the existing static UI and UX-01–UX-04.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|---|---|---|---|
| Mobile screen flow and visible states | Browser / Client | — | The approved product remains a browser-local, semantic HTML/CSS/JS prototype. [VERIFIED: 01-UI-SPEC.md:18,24-29] |
| Design tokens and component rules | Browser / Client | CDN / Static | `DESIGN.md` documents CSS/markup contracts for a static page; it introduces no runtime service. [VERIFIED: 01-UI-SPEC.md:24-29; VERIFIED: styles.css:1] |
| Usability observations and event dictionary | Human research process | Browser / Client | Observation is manually recorded around the concept; no browser telemetry is authorized. [VERIFIED: 01-CONTEXT.md:38-39; VERIFIED: 01-UI-SPEC.md:203-215] |
| Participant consent and minimised notes | Human research process | — | Consent, collection boundaries, and anonymised reporting precede any research recording. [CITED: https://www.w3.org/TR/2020/WD-coga-usable-20201211/usability_testing.html] |

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---|---|---|---|
| Semantic HTML | browser native | Existing form/landmark vocabulary and documentation examples | The project already uses native forms and labels; no library is needed for a documentation-first phase. [VERIFIED: index.html:3-8] |
| CSS custom properties | browser native | Future named design-token expression | `:root` is the current styling entry point. [VERIFIED: styles.css:1] |
| Vanilla JavaScript | browser native | Later rendering/focus examples only | The current app is a single IIFE with browser APIs; Phase 1 adds no runtime code. [VERIFIED: app.js:1-25] |

### Supporting

| Library | Version | Purpose | When to Use |
|---|---|---|---|
| None | — | No dependency is authorized | Do not install an icon set, wireframe app, test framework, or analytics SDK for this phase. [VERIFIED: 01-CONTEXT.md:39; VERIFIED: 01-UI-SPEC.md:24-29] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|---|---|---|
| Markdown-first artifacts | Third-party analytics or design/component packages | Not selected: they add collection, dependency, or product-scope decisions that the locked tracking-free, dependency-free phase excludes. [VERIFIED: 01-CONTEXT.md:39; VERIFIED: 01-UI-SPEC.md:18] |

**Installation:** None — no package installation belongs in this phase. [VERIFIED: 01-UI-SPEC.md:24-29]

## Package Legitimacy Audit

Not applicable: the Phase 1 plan must not install external packages. [VERIFIED: 01-CONTEXT.md:39; VERIFIED: 01-UI-SPEC.md:24-29]

## Architecture Patterns

### System Architecture Diagram

```text
Approved scope + 01-UI-SPEC + current static UI
                    |
                    v
        DESIGN.md (tokens, components, states, accessibility)
                    |
          +---------+----------+
          v                    v
  Mobile flow/state map   Observation + event sheet
          |                    |
          +---------+----------+
                    v
        Documentation review against UX-01..UX-04
                    |
                    v
 Later browser-only implementation / moderated concept sessions
          (no SDK, account, tracker, or uploaded participant data)
```

The one-way flow prevents the documents from being confused with implementation telemetry or evidence of research results. [VERIFIED: 01-CONTEXT.md:9-11,38-39]

### Recommended Project Structure

```text
DESIGN.md                                      # reusable product-wide visual/interaction contract
.planning/phases/AUTORITM-01-product-analytics-and-visual-concept/
├── 01-UI-SPEC.md                              # canonical approved UI contract (already present)
├── 01-UX-FLOW.md                              # screen transitions, state matrix, UX requirement trace
└── 01-OBSERVATION-PLAN.md                     # consent script, task protocol, blank event/observation sheet
```

`01-UX-FLOW.md` and `01-OBSERVATION-PLAN.md` are recommended planning outputs, not currently existing files. [ASSUMED]

### Pattern 1: Single-source design contract

**What:** Put tokens, typography, spacing, control/card rules, state treatments, accessibility rules, and a component-to-token matrix in root `DESIGN.md`; link to it from the two Phase 1 artifacts instead of duplicating values. [VERIFIED: .planning/REQUIREMENTS.md:30; VERIFIED: 01-UI-SPEC.md:59-108]

**When to use:** Whenever a planner specifies a visible screen or component in any later phase. [ASSUMED]

**Implementation guidance:** Copy the locked roles verbatim into `DESIGN.md`: `#F6F8F3`, `#FFFFFF`, `#173D33`, `#1D4938`, `#43A979`, `#B5E6C9`, and `#B42318`; declare their semantic role, allowed usage, foreground, and non-colour counterpart. [VERIFIED: 01-CONTEXT.md:27; VERIFIED: 01-UI-SPEC.md:92-101]

### Pattern 2: State transition table, not a routed application

**What:** Document the four patterns `Автомобиль → План обслуживания → История и расходы → Контроль`, with an entry condition, exactly one primary action, success state, error state, focus outcome, and next anchor/field. [VERIFIED: 01-UI-SPEC.md:46-57]

**When to use:** For mobile walkthroughs and subsequent implementation planning; this does not mandate a router. [VERIFIED: 01-UI-SPEC.md:48]

### Pattern 3: Observation-only event dictionary

**What:** Define each observation as a human-recorded row: event name, trigger/task, observable evidence, allowed fields, and a blank outcome. Use participant code rather than name; record only device/browser, task order, completion/help, time, misread label, quoted explanation, and design issue. [VERIFIED: 01-UI-SPEC.md:203-215]

**When to use:** During a 5–7-person concept session after explicit consent, with storage reset between participants. [VERIFIED: 01-CONTEXT.md:38; VERIFIED: 01-UI-SPEC.md:203-215]

### Anti-Patterns to Avoid

- **Invented analytics:** Do not add a script, identifier, dashboard, or success rate; the artifact may define a blank observation field only. [VERIFIED: 01-CONTEXT.md:39; VERIFIED: 01-UI-SPEC.md:203-215]
- **Scope-placeholder UI:** Do not add inactive multi-car, account, sync, VIN, OCR/AI, fuel, valuation, or notifications controls. [VERIFIED: 01-UI-SPEC.md:193-201]
- **State implied by colour:** Due/overdue must combine colour with explicit text and an icon/shape. [VERIFIED: 01-CONTEXT.md:27; CITED: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color]
- **Browser-alert specification:** The existing handlers call `alert(...)`; the future contract must specify field-linked errors and persistent storage failure rather than preserve that interaction. [VERIFIED: app.js:9,21-24; VERIFIED: 01-UI-SPEC.md:110-149]

## Don’t Hand-Roll

| Problem | Don’t Build | Use Instead | Why |
|---|---|---|---|
| Product telemetry | A client tracker, identity scheme, or metrics dashboard | A manually completed observation sheet | Tracking is explicitly out of scope and a small study needs observed, consented evidence—not synthetic KPIs. [VERIFIED: 01-CONTEXT.md:38-39; CITED: https://www.w3.org/TR/2020/WD-coga-usable-20201211/usability_testing.html] |
| Visual consistency | Ad hoc per-screen colour/spacing decisions | Root `DESIGN.md` token and component table | UX-04 explicitly requires one reusable design source. [VERIFIED: .planning/REQUIREMENTS.md:30] |
| Status semantics | A colour-only red/green convention | Textual due reason plus icon/shape and semantic token | WCAG says colour cannot be the sole visual means of conveying information. [CITED: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color] |
| Interaction model | SPA routing or a design-system framework | Anchored single-page screen patterns | The approved contract says patterns do not mandate a router and uses native static-project tools. [VERIFIED: 01-UI-SPEC.md:24-29,48] |

**Key insight:** The highest-value Phase 1 implementation is a precise, reusable contract; new code or packages would create commitments before the contract has been tested. [VERIFIED: 01-CONTEXT.md:9-11,39]

## Common Pitfalls

### Pitfall 1: Treating a test plan as research results

**What goes wrong:** The documents report conversion, task success, or satisfaction figures before sessions occur. [VERIFIED: 01-CONTEXT.md:38]

**How to avoid:** Label every outcome column blank until observed; after sessions, report counts and anonymised quotes only, identify the sample as exploratory, and keep a decision/backlog separate from raw notes. [VERIFIED: 01-UI-SPEC.md:203-215; CITED: https://www.w3.org/TR/2020/WD-coga-usable-20201211/usability_testing.html]

### Pitfall 2: Letting the current prototype override the approved interaction contract

**What goes wrong:** Current `alert(...)` calls, compact 10–12px typography, and 32px icon controls become the presumed finished UX. [VERIFIED: app.js:9,11,21-24; VERIFIED: styles.css:1]

**How to avoid:** Treat current files as a baseline inventory; put the approved future rules in `DESIGN.md` and a gap list, without changing the files in this documentation phase. [VERIFIED: 01-UI-SPEC.md:31-44,103-159]

### Pitfall 3: Hiding urgency or manual-entry provenance

**What goes wrong:** A red status suggests urgency but not its date/mileage cause, or a manual deadline appears factory-verified. [VERIFIED: 01-CONTEXT.md:33]

**How to avoid:** Specify the exact reason variants—date, mileage, both—and include the manual-deadline/vehicle-manual reminder alongside every plan. [VERIFIED: 01-UI-SPEC.md:123-132]

### Pitfall 4: Collecting more participant data than the task needs

**What goes wrong:** Names, accounts, raw recordings, or third-party identifiers enter a study whose questions can be answered with coded observations. [VERIFIED: 01-CONTEXT.md:39]

**How to avoid:** Obtain informed consent before notes/recording; state purpose, fields, access, retention/deletion owner, and withdrawal handling in the plan. Use participant codes and anonymise quotes in the report. [CITED: https://www.w3.org/TR/2020/WD-coga-usable-20201211/usability_testing.html]

## Code Examples

### Event/observation row (schema, not runtime analytics)

```md
| Event | Task trigger | Evidence to record | Outcome |
|---|---|---|---|
| `vehicle_save_attempt` | Participant submits `Автомобиль` | completion/help; elapsed time; storage-boundary explanation | blank until session |
| `maintenance_due_explained` | Participant sees a due card | date/mileage/both explanation; selected next action | blank until session |
| `expense_total_checked` | Participant saves expense | latest-entry and total comprehension | blank until session |
```

Use a code rather than a name in the accompanying row, and do not transmit the table from the prototype. [VERIFIED: 01-UI-SPEC.md:203-215; CITED: https://www.w3.org/TR/2020/WD-coga-usable-20201211/usability_testing.html]

### DESIGN.md completion checklist

```md
- [ ] Named roles: page, surface, ink, primary, accent, soft accent, danger
- [ ] 8px spacing scale; 8px control radius; 16px card radius
- [ ] 44px minimum primary touch target
- [ ] Four screen patterns and five states per relevant screen
- [ ] Urgent status has text + icon/shape + semantic danger role
- [ ] Field error, success/status, destructive confirmation, and focus-return rules
```

These are the approved values: “an 8px spacing scale, a 44px minimum target for primary touch actions, 8px control radius and 16px card radius.” [VERIFIED: 01-CONTEXT.md:28]

## State of the Art

| Old Approach | Current Approach | Impact |
|---|---|---|
| Static mockup or colour-only status | State-aware visual contract with textual reason, icon/shape, and WCAG checks | A future UI can be reviewed for observable behavior before it is implemented. [VERIFIED: 01-CONTEXT.md:32-34; CITED: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color] |
| Third-party/product telemetry assumption | Consent-based, manually recorded usability observations | Preserves the tracking-free boundary and avoids invented metrics. [VERIFIED: 01-CONTEXT.md:38-39] |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|---|---|---|
| A1 | `01-UX-FLOW.md` is a useful separate phase artifact rather than an expansion of `01-UI-SPEC.md`. | Recommended Project Structure | Creates documentation duplication; planner can instead add a traceability appendix to the existing UI spec. |
| A2 | `01-OBSERVATION-PLAN.md` should be separate from the UI contract. | Recommended Project Structure | Creates a redundant file; planner can use the existing observation-plan section if it adds the reusable blank sheet elsewhere. |

## Resolved research decisions

1. **Canonical observation-template location — RESOLVED.** The single session-ready source is the stand-alone `01-OBSERVATION-PLAN.md`; `01-UI-SPEC.md` and `01-UX-FLOW.md` link to it rather than duplicating a mutable result sheet.
2. **Recording policy — RESOLVED.** The ordinary Phase 1 method is consented typed anonymous notes. There is no audio/video recording. Any later proposal to record requires separate documented purpose, storage, access, retention/deletion, and withdrawal terms before recruitment.

## Environment Availability

Step 2.6: **SKIPPED** — this documentation-only phase has no external runtime, service, CLI, package manager, or hosted dependency. [VERIFIED: 01-CONTEXT.md:9-11,39]

## Validation Architecture

### Test Framework

| Property | Value |
|---|---|
| Framework | none detected — documentation/artifact review is the Phase 1 validation method. [VERIFIED: workspace scan, 2026-11-09] |
| Config file | none — see Wave 0. [VERIFIED: workspace scan, 2026-11-09] |
| Quick run command | manual document-review checklist |
| Full suite command | manual cross-artifact review; no automated suite exists. [VERIFIED: workspace scan, 2026-11-09] |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|---|---|---|---|---|
| UX-01 | Four mobile transitions each expose one primary next action | manual artifact walkthrough at 320px concept width | — | ❌ Wave 0 |
| UX-02 | Empty, success, validation-error, and due states have copy/treatment | manual state-matrix review | — | ❌ Wave 0 |
| UX-03 | Urgent and normal states have non-colour differentiation and readable controls | contrast/target-size review against `DESIGN.md` | — | ❌ Wave 0 |
| UX-04 | All screen references point to the same named tokens/components | cross-document traceability review | — | ❌ Wave 0 |

### Sampling Rate

- **Per task commit:** verify modified documentation links, headings, and UX requirement references.
- **Per wave merge:** execute the artifact walkthrough and the `DESIGN.md` checklist.
- **Phase gate:** all UX-01–UX-04 rows have evidence in a document; no result/metric is marked achieved before a consented session.

### Wave 0 Gaps

- [ ] `DESIGN.md` — reusable token, type, spacing, component, state, and accessibility contract for UX-04.
- [ ] One canonical mobile-flow/state map — covers UX-01 and UX-02.
- [ ] One consent-aware blank observation/event template — enables D-10/D-11 without telemetry.
- [ ] No automated test framework is necessary for documentation-only Phase 1; later UI implementation should introduce test tooling only if its plan requires executable behavior checks. [ASSUMED]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---|---|---|
| V2 Authentication | No | Accounts are out of scope. [VERIFIED: 01-CONTEXT.md:11,116] |
| V3 Session Management | No | No account/session is introduced. [VERIFIED: 01-CONTEXT.md:11,116] |
| V4 Access Control | No | The concept is browser-local and documentation-only. [VERIFIED: 01-CONTEXT.md:9-11] |
| V5 Input Validation | Yes, as a future UI contract | Document field-linked errors, an explicit date-or-mileage rule, and safe user-text rendering; implementation is deferred. [VERIFIED: 01-UI-SPEC.md:136-143; VERIFIED: app.js:10] |
| V6 Cryptography | No | No secrets, credentials, transmission, or encrypted store is added. [VERIFIED: 01-CONTEXT.md:11,39] |

### Known Threat Patterns for the Phase

| Pattern | STRIDE | Standard Mitigation |
|---|---|---|
| Participant re-identification through notes/recordings | Information disclosure | Informed consent, data minimisation, participant code, anonymised quotes, stated retention/deletion process. [CITED: https://www.w3.org/TR/2020/WD-coga-usable-20201211/usability_testing.html] |
| Scope creep through “analytics” | Information disclosure | Observation-only template; no SDK, account identifier, or background collection. [VERIFIED: 01-CONTEXT.md:39] |
| Misleading safety/maintenance advice | Spoofing / integrity | Mark deadlines as manual and direct users to the vehicle manual. [VERIFIED: 01-CONTEXT.md:33; VERIFIED: 01-UI-SPEC.md:132] |

## Sources

### Primary (HIGH confidence)

- [01-CONTEXT.md](01-CONTEXT.md) — locked decisions, scope fence, and observation/tracking constraints.
- [01-UI-SPEC.md](01-UI-SPEC.md) — screen transitions, visual tokens, state/focus/copy contract, and observation protocol.
- [Requirements](../../REQUIREMENTS.md) — UX-01 through UX-04 wording and traceability.
- [Current static prototype](../../../index.html), [styles](../../../styles.css), [behavior](../../../app.js) — actual baseline markup, CSS, and browser-state behavior.

### Secondary (MEDIUM confidence)

- [W3C WCAG 2.2 — Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color) — visible non-colour state cues.
- [W3C WCAG 2.2 — Contrast / target-size requirements](https://www.w3.org/TR/WCAG22/) — 4.5:1 normal-text contrast and pointer-target baseline; the project’s 44px target is stricter enhanced guidance.
- [W3C usability testing and informed consent](https://www.w3.org/TR/2020/WD-coga-usable-20201211/usability_testing.html) — consent and anonymised reporting guidance.

### Tertiary (LOW confidence)

- None.

## Metadata

**Confidence breakdown:**

- Standard stack: **HIGH** — it is directly verified from the existing dependency-free static files. [VERIFIED: index.html:1-9; VERIFIED: styles.css:1; VERIFIED: app.js:1-25]
- Architecture: **HIGH** — scope and tier ownership are locked by context and UI specification. [VERIFIED: 01-CONTEXT.md:9-11,38-39; VERIFIED: 01-UI-SPEC.md:18-29]
- Accessibility/usability safeguards: **MEDIUM** — supported by W3C standards/guidance but must be validated with the intended 5–7 participants. [CITED: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color; CITED: https://www.w3.org/TR/2020/WD-coga-usable-20201211/usability_testing.html]

**Research date:** 2026-11-09  
**Valid until:** 2027-02-09 for the locked static phase scope; revisit before introducing participant recordings, telemetry, or external integrations. [ASSUMED]
