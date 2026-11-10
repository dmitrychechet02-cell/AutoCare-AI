# Phase 1: Product Analytics and Visual Concept - Context

**Gathered:** 2026-11-09  
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase converts the approved product research into an implementation-ready mobile UX and visual contract for the existing one-car local prototype. It delivers the core journey, screen/state patterns, usability-validation outline, event/observation plan, and `DESIGN.md` rules that a later implementation phase can apply without changing the product scope or claiming unverified data.

It does **not** add accounts, cloud sync, manufacturer schedules, VIN data, OCR/AI, market valuation, background notifications, multiple vehicles, fuel tracking, or new backend services.

</domain>

<decisions>
## Implementation Decisions

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

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product scope and research

- `PRD.md` — problem, persona, competitor analysis, happy path, user stories, acceptance criteria and explicit scope fence.
- `.planning/PROJECT.md` — core value, constraints and locked product decisions.
- `.planning/REQUIREMENTS.md` — phase requirements UX-01 through UX-04 and their traceability.
- `.planning/ROADMAP.md` §Phase 1 — phase boundary and observable success criteria.
- `.planning/research/SUMMARY.md` — research synthesis, phase ordering, confidence and deferred integration risks.
- `.planning/research/FEATURES.md` — researched table stakes, differentiators and anti-features.
- `.planning/research/PITFALLS.md` — false-confidence, storage, date/mileage and accessibility safeguards.

### Existing product and visual baseline

- `index.html` — current semantic sections, forms, cards and `aria-live` save confirmation.
- `app.js` — current local state, render flow, validation conditions and local-storage boundary.
- `styles.css` — existing pine/mint palette, card/input/button patterns and responsive breakpoint.
- `README.md` — truthful current limitations and explicitly deferred capabilities.

### Course materials

- `../Лекции_Отус/Лекция_7/konspekt_lekcii_7.html` — feasibility checks, product hypotheses, competitor research and agent-context guidance.
- `../Лекции_Отус/Конспект_Лекция_8.html` — happy path, user stories, Given/When/Then acceptance criteria, requirements and GSD planning workflow.
- `../Лекции_Отус/Лекция_9/Лекция_9_Проектируем_UX_конспект.html` — UX heuristics, `DESIGN.md` structure, accessibility, references and role-based colour selection.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- `index.html` forms `#car-form`, `#task-form` and `#expense-form` — direct screens for the core journey; each has identifiable field labels and a primary action.
- `#car-summary` with `aria-live="polite"` — starting point for non-blocking saved-state feedback.
- `app.js` functions `save()`, `render()` and `item()` — current single mutation/render path that future UI work must preserve or improve coherently.
- `styles.css` `.card`, `.fields`, `.stack`, `.item`, `.total` and the `max-width: 750px` responsive layout — reusable component vocabulary for the visual contract.

### Established Patterns

- Browser-only state is an object with `car`, `tasks` and `expenses` stored under `autoritm-v1` in `localStorage`.
- DOM content is created with `textContent`, preserving a safe rendering pattern.
- The existing design already uses a dark-pine hero, white cards and mint accents; the phase evolves rather than replaces this language.

### Integration Points

- `styles.css :root` is the eventual entry point for named design tokens.
- The existing messages, forms and task rows are the integration points for empty, success, validation and due-state specifications.
- The hero CTA anchors to `#garage`; a future mobile journey may retain this simple single-page navigation rather than introduce a router.

</code_context>

<specifics>
## Specific Ideas

- Borrow category patterns, not branding: Auto.ru Garage supplies the trusted “all car information together” promise; Drivvo supplies date-or-mileage service logic; Fuelio supplies visible due progress; none justifies an external-data promise in this MVP.
- Prefer concrete Russian language such as «Срок наступил по пробегу», «До 15 декабря» and «Через 1 200 км» over generic warning labels.
- One reference per screen/component is enough; avoid mosaics of unrelated design galleries.

</specifics>

<deferred>
## Deferred Ideas

- Verified manufacturer maintenance schedules, VIN/recall history and vehicle valuation — require a licensed, auditable provider and a dedicated research phase.
- OCR/AI receipt or order parsing — requires file handling, user confirmation, provenance and security design.
- Push notifications, accounts, cloud sync, backup/export/import and multi-vehicle support — require a separate data-continuity decision and implementation phase.
- Fuel, routes, income and fleet features — do not support the current one-car service-book job.

</deferred>

---

*Phase: 1-Product Analytics and Visual Concept*  
*Context gathered: 2026-11-09*
