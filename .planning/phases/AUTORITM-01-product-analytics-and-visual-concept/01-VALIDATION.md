---
phase: "AUTORITM-01"
slug: "product-analytics-and-visual-concept"
status: validated-documentation
nyquist_compliant: true
wave_0_complete: true
created: "2026-11-09"
---

# Phase AUTORITM-01 — Validation Strategy

> Validation contract for documentation-first UX and visual-concept work. This phase deliberately has no runtime feature change or automated suite.

## Test Infrastructure

| Property | Value |
|---|---|
| **Framework** | None — reviewable Markdown artifacts and manual concept walkthrough |
| **Config file** | None |
| **Quick run command** | Manual link-and-requirement traceability review |
| **Full suite command** | Manual four-screen/state walkthrough at 320px concept width |
| **Estimated runtime** | ~15 minutes per reviewer |

## Sampling Rate

- **After every documentation task:** check that source links resolve, the file names are canonical, and UX-01–UX-04 references are still accurate.
- **After every plan wave:** perform the screen/state walkthrough and design-token checklist below.
- **Before `$gsd-verify-work`:** all artifact rows must be present; no usability outcome or KPI may be written as achieved before a consented session.
- **Participant sampling:** later run the approved five-task protocol with 5–7 matching private owners; record only consented, anonymised observations.

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---|---|---|---|---|---|---|---|---|---|
| AUTORITM-01-01 | 01 | 1 | UX-04 | T-01-01 | Design tokens do not imply external data or tracking | Manual document review + content gate | `powershell -NoProfile -Command '& { Test-Path DESIGN.md }'` | ✅ | ✅ documentation validated |
| AUTORITM-01-02 | 01 | 1 | UX-01, UX-02, UX-03 | T-01-02 | State/copy map exposes manual due reason and non-colour urgency | Manual concept walkthrough + content gate | `powershell -NoProfile -Command '& { Test-Path .planning/phases/AUTORITM-01-product-analytics-and-visual-concept/01-UX-FLOW.md }'` | ✅ | ✅ documentation validated |
| AUTORITM-01-03 | 01 | 1 | UX-01, UX-02 | T-01-03 | Observation template minimises participant data and records no fabricated result | Manual artifact review + content gate | `powershell -NoProfile -Command '& { Test-Path .planning/phases/AUTORITM-01-product-analytics-and-visual-concept/01-OBSERVATION-PLAN.md }'` | ✅ | ✅ documentation validated |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

## Wave 0 Requirements

- [x] `DESIGN.md` — product-wide token, typography, component, state and accessibility contract.
- [x] `.planning/phases/AUTORITM-01-product-analytics-and-visual-concept/01-UX-FLOW.md` — four-screen transition and state map.
- [x] `.planning/phases/AUTORITM-01-product-analytics-and-visual-concept/01-OBSERVATION-PLAN.md` — consent-aware blank task/event observation sheet.
- [x] No test-framework installation — the phase creates planning artifacts, not executable UI behavior.

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|---|---|---|---|
| Every screen has one clear next action | UX-01 | No interactive redesign is implemented in this phase | Follow `01-UX-FLOW.md` from vehicle setup through control; verify each step names one primary action and a resulting focus/anchor. |
| Empty, success, validation-error and due states are explicit | UX-02 | State contract is reviewed before code exists | Cross-check each required state in `01-UX-FLOW.md` and `01-UI-SPEC.md` against its Russian copy, visual treatment and recovery action. |
| Urgency is readable without colour | UX-03 | Contrast/non-colour semantics need visual judgement | Check named contrast roles in `DESIGN.md`; verify each due state includes a reason sentence plus icon/shape. |
| Shared visual rules apply across screens | UX-04 | This is a cross-document design-governance check | Confirm every screen/component reference points to the named roles, typography, spacing and component rules in root `DESIGN.md`. |
| Study does not manufacture evidence or collect excess data | D-10, D-11 | Requires human review of research materials | Confirm all outcome cells in `01-OBSERVATION-PLAN.md` are blank templates and participant identity is a code, not a name/account/device identifier. |

## Validation Sign-Off

- [x] Every planned artifact has a manual verification row.
- [x] Sampling continuity: each task is reviewed before the next documentation artifact depends on it.
- [x] Wave 0 artifacts exist and cross-reference UX-01–UX-04.
- [x] Lightweight content-gate commands confirm artifact presence; manual review remains the behavioral verification method.
- [x] Usability observations are clearly labelled exploratory and consent-based.
- [x] `nyquist_compliant: true` set in frontmatter after the three artifacts and manual checks exist.

## Evidence recorded on 2026-11-09

- The approved plan passed structural review, all four requirements UX-01–UX-04, decisions D-01–D-11, and its proportionate privacy/threat model.
- `DESIGN.md`, `01-UX-FLOW.md`, and `01-OBSERVATION-PLAN.md` passed presence and marker gates for the required tokens, four path steps, state/recovery copy, consent boundary, blank observation outcomes, and no-change one-car decision.
- This sign-off validates documentation completeness only. It does **not** claim that a participant completed a task, that usability results exist, or that the runtime prototype has been redesigned.

## Traceability confirmed

| Scope | Evidence | Status |
|---|---|---|
| UX-01 | Four explicit screen transitions with one primary CTA, outcome and focus destination in `01-UX-FLOW.md`. | ✅ documented |
| UX-02 | Empty, ready, saved, validation, due, storage-failure and deletion treatments in `DESIGN.md` and `01-UX-FLOW.md`. | ✅ documented |
| UX-03 | Text + icon/shape reason for date, mileage or both; semantic danger role; contrast/accessibility rules in `DESIGN.md`. | ✅ documented |
| UX-04 | Shared named colour, type, spacing, radius, component and responsive rules in `DESIGN.md`. | ✅ documented |
| D-01–D-03 | One-car happy path and control-before-expenses priority in `01-UX-FLOW.md`. | ✅ documented |
| D-04–D-06 | Visual tone, role-based palette, system type, spacing and mobile geometry in `DESIGN.md`. | ✅ documented |
| D-07–D-09 | State, provenance, live-region and focus contracts in `DESIGN.md` and approved `01-UI-SPEC.md`. | ✅ documented |
| D-10–D-11 | 5–7-person consent-first, anonymous, no-tracking protocol in `01-OBSERVATION-PLAN.md`. | ✅ documented |

**Approval:** documentation validated; participant research and runtime implementation remain future work.
