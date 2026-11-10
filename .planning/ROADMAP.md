# Roadmap: АвтоРитм

## Overview

Рабочий статический MVP уже подтверждает базовый локальный сценарий. Эта дорожная карта сначала превращает продуктовые решения в проверяемую mobile-first визуальную концепцию и план продуктовых наблюдений, затем последовательно доводит существующие автомобиль, план ТО и журнал расходов до единого честного и доступного пользовательского пути без смены HTML/CSS/JavaScript-стека. Каждый v1 requirement закреплён за одной фазой.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Product Analytics and Visual Concept** - A testable mobile UX contract, visual system, and minimal measurement plan for the core loop.
- [ ] **Phase 2: Vehicle and Local-Data Trust** - Make the one-car entry point reliable and transparent about browser-only storage.
- [ ] **Phase 3: Maintenance Plan and Clear Due Status** - Let owners create valid plans and understand the next deadline.
- [ ] **Phase 4: Service History and Cost Control** - Let owners maintain a correct, reviewable record of completed work and spending.

## Phase Details

### Phase 1: Product Analytics and Visual Concept
**Goal**: Users and test participants can understand the intended one-hand mobile path and its states before the existing MVP is refined.
**Depends on**: Nothing (first phase)
**Requirements**: UX-01, UX-02, UX-03, UX-04
**Success Criteria** (what must be TRUE):
  1. A test participant can follow a mobile-screen concept from adding a vehicle through planning maintenance and logging a completed job to reviewing what needs attention, with one clear next action at each step.
  2. The visual concept makes the empty list, saved confirmation, input error, and due-maintenance states distinct and understandable before an implementation is judged against it.
  3. A participant can distinguish normal and urgent maintenance in the concept through text and an additional non-colour cue, while control labels and body text remain readable.
  4. Key mobile screens visibly apply the same documented colour roles, typography, spacing, and component rules from `DESIGN.md`.
**Plans**: [01-01-PLAN.md](phases/AUTORITM-01-product-analytics-and-visual-concept/01-01-PLAN.md) — prepared, not executed
**UI hint**: yes

### Phase 2: Vehicle and Local-Data Trust
**Goal**: A car owner can create a trustworthy local profile for one vehicle and understand where it is stored.
**Depends on**: Phase 1
**Requirements**: VEH-01, VEH-02
**Success Criteria** (what must be TRUE):
  1. A user can enter make, model, year, and current mileage and sees a saved confirmation that identifies the vehicle.
  2. An incomplete vehicle profile is not accepted, and the relevant field tells the user what needs correcting.
  3. Before or when saving, the user is clearly told that the data remains only in the current browser and device.
**Plans**: TBD
**UI hint**: yes

### Phase 3: Maintenance Plan and Clear Due Status
**Goal**: A car owner can record a valid planned job and tell when it needs attention.
**Depends on**: Phase 1, Phase 2
**Requirements**: MNT-01, MNT-02, MNT-03
**Success Criteria** (what must be TRUE):
  1. A user can add a named maintenance job with a due date, a mileage threshold, or both, and sees it in the plan.
  2. Each planned job states whether it is due now, how many kilometres remain, or the date by which it should be completed, including a clear outcome when either criterion has arrived.
  3. A user cannot save a maintenance job without its name and at least one due criterion, and receives an understandable correction message.
**Plans**: TBD
**UI hint**: yes

### Phase 4: Service History and Cost Control
**Goal**: A car owner can keep a correct local history of completed work and see the resulting spending total.
**Depends on**: Phase 2, Phase 3
**Requirements**: HIS-01, HIS-02, HIS-03
**Success Criteria** (what must be TRUE):
  1. A user can add a completed job or expense with its name, amount, and date, with mileage available when relevant.
  2. The user sees history in reverse chronological order and can remove an erroneous entry.
  3. The displayed total expenses updates correctly after both adding and deleting a history entry.
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Product Analytics and Visual Concept | 0/1 | Planned — ready to execute | - |
| 2. Vehicle and Local-Data Trust | 0/TBD | Not started | - |
| 3. Maintenance Plan and Clear Due Status | 0/TBD | Not started | - |
| 4. Service History and Cost Control | 0/TBD | Not started | - |
