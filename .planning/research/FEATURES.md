# Feature Landscape

**Domain:** local-first, mobile web service log for one private car in Russia (АвтоРитм)
**Researched:** 2026-11-09
**Evidence confidence:** LOW — the research seam classifies the Brave provider LOW. The cited first-party pages corroborate category patterns, but they are competitor/product claims, not independent user research.

## Evidence and Scope Rule

**Observed evidence:** Drivvo explicitly combines a service record (odometer and cost), history, and a deadline determined by whichever comes first: date or mileage. [Drivvo](https://www.drivvo.com/en/vehicle-maintenance/) Fuelio documents the same deadline choices and marking a repeated task complete. [Fuelio](https://www.fuel.io/en-US/features/reminders/) Russian products likewise present history, mileage, costs, and upcoming dates together: [MemoCar](https://memocar.ru/) and [АвтоЛог on Google Play](https://play.google.com/store/apps/details?hl=ru&id=net.inettools.autolog).

**Product decisions / assumptions:** “one car”, manual input as truth, browser-local storage, and no external data are deliberate АвтоРитм constraints from `PRD.md` and `REQUIREMENTS.md`; they are not inferred market facts. A feature is MVP table stakes below only when it serves that constrained loop, not merely because a larger competitor offers it.

## Table Stakes

Features users should receive in this narrowly defined service-book MVP. Omitting one would break the promised path: car → planned work → completed work/cost → clear control.

| Feature | Why Expected | Complexity | Notes |
|---|---|---:|---|
| One-car passport: make, model, year, current mileage | **Decision:** it establishes which vehicle the manually entered history belongs to. Competitors begin with a vehicle profile; Auto.ru Garage supports vehicle addition, while АвтоЛог stores car identity and mileage. [Auto.ru support](https://auto.ru/support/recall), [АвтоЛог](https://play.google.com/store/apps/details?hl=ru&id=net.inettools.autolog) | Low | Require the four fields in VEH-01; modification and region stay optional. Do not imply VIN lookup or verified specification. |
| Create a maintenance plan with a name and at least one deadline | **Observed:** Drivvo and Fuelio both support date, mileage, or both, with date-or-mileage logic. [Drivvo](https://www.drivvo.com/en/vehicle-maintenance/), [Fuelio](https://www.fuel.io/en-US/features/reminders/) | Medium | MNT-01/MNT-03. The user supplies the interval/deadline; no factory schedule is presumed. |
| Plain-language due status | **Observed:** date/mileage tracker products surface approaching and due work; АвтоЛог names “on time / soon / overdue”. [Fuelio](https://www.fuel.io/en-US/features/reminders/), [АвтоЛог](https://play.google.com/store/apps/details?hl=ru&id=net.inettools.autolog) | Medium | MNT-02: show “срок наступил”, remaining kilometres, or deadline date. Text and icon must carry urgency, not colour alone. |
| Completed-work and expense entry | **Observed:** Drivvo records service, odometer, cost, and date; MemoCar records maintenance, repair, work, parts, and mileage. [Drivvo](https://www.drivvo.com/en/vehicle-maintenance/), [MemoCar](https://memocar.ru/) | Low | HIS-01. MVP needs name, amount, date, optional mileage; avoid a parts/labour taxonomy until users demand it. |
| Reverse-chronological service history with correction | **Observed:** Drivvo describes a history of what was done, where, and at what cost; MemoCar describes chronological service history. [Drivvo](https://www.drivvo.com/en/vehicle-maintenance/), [MemoCar](https://memocar.ru/) | Low | HIS-02. Deletion is essential correction for a local manual log; confirm destructive actions in UI. |
| Total maintenance spending | **Observed:** category products expose cost visibility; Fuelio has a cost log and MemoCar presents monthly/yearly/all-time expenses. [Fuelio](https://www.fuel.io/en-US/features/reminders/), [MemoCar](https://memocar.ru/) | Low | HIS-03. Start with one trustworthy all-time total; charts/categories are not required for the first loop. |
| Explicit local-data and empty/error/success states | **Decision:** this follows the privacy and integrity constraints. An adjacent Russian tracker, АвтоЛог, explicitly says its records are local and it does not replace manufacturer guidance. [АвтоЛог](https://play.google.com/store/apps/details?hl=ru&id=net.inettools.autolog) | Low | VEH-02 and UX-02. Tell users that clearing browser data can remove the log and that deadlines are manual. |

## Differentiators

Differentiation should come from clarity and trust, not an expansion into a full vehicle ecosystem.

| Feature | Value Proposition | Complexity | Notes |
|---|---|---:|---|
| “What needs attention now?” single-card overview | **Observed pattern:** MemoCar’s dashboard puts expenses, mileage, and nearest reminders in one view. [MemoCar](https://memocar.ru/) **АвтоРитм decision:** make the next action more prominent than analytics. | Medium | A focused dashboard: nearest planned item, overdue count, and total spend. It is a composition of table stakes, not a new data source. |
| Transparent deadline explanation | **Decision:** show whether date, mileage, or both made an item due, and state that the user entered the deadline. This protects against false authority and distinguishes the product from opaque “smart” schedules. | Low | For both criteria, label “what came first”; never label it “manufacturer-required” without licensed source data. |
| Calm, accessible mobile service book | **Decision:** the promised UX is a quick one-hand check-in rather than an automotive social network or sales funnel. | Medium | Keep one primary next action, readable controls, empty-state guidance, and text/icon urgency. Validate in 5–7 usability sessions rather than treating the visual concept as market-proven. |
| Friction-light local start with no account | **Comparable evidence:** Fuelio says no account is needed and data remains on-phone unless backed up. [Fuelio](https://www.fuel.io/en-US/features/reminders/) **АвтоРитм assumption:** this reduces first-use friction for the stated prototype audience. | Low | Explain the trade-off at onboarding: no sync or recovery in v1. |

## Anti-Features

These are valuable in wider products, but explicitly wrong for this one-car, local MVP or impossible to promise honestly at its current trust boundary.

| Anti-Feature | Why Avoid | What to Do Instead |
|---|---|---|
| Automatic OEM maintenance schedule or repair advice | It requires a correct model/modification mapping, current source, permissions, and safety framing. Drivvo itself tells users the owner’s manual outranks generic intervals. [Drivvo](https://www.drivvo.com/en/vehicle-maintenance/) | Let users enter their own deadline; say to consult the car manual. Defer to DATA-01. |
| VIN report, valuation, recall aggregation, or “complete vehicle history” | Auto.ru Garage can use VIN/registration data and says recall information comes from Rosstandart. [Auto.ru support](https://auto.ru/support/recall) **Decision:** no licensed data integration exists for АвтоРитм v1. | Capture only manual car fields; do not mimic a verified report. |
| OCR/AI/voice ingestion of checks and work orders | MemoCar promotes photo/voice-assisted entry. [MemoCar](https://memocar.ru/) **Decision:** a local static prototype cannot safely extract, verify, or retain document data. | Manual entry now; later create a review-before-save workflow (DOCS-01). |
| Background/push reminders | Fuelio’s daily notifications require native/background notification capability and user settings. [Fuelio](https://www.fuel.io/en-US/features/reminders/) | Show due status when the app is opened; defer permissioned notifications to NOTF-01. |
| Multi-car, fleet, family, or shared access | Drivvo supports family/fleet and MemoCar offers shared access, but those add identity, authorization, data isolation, and synchronisation concerns. [Drivvo](https://www.drivvo.com/en/vehicle-maintenance/), [MemoCar](https://memocar.ru/) | Preserve one car as the product boundary. |
| Fuel log, trips, navigation, marketplace, or gamified club | Fuelio exposes fuel, trips, prices, reports and CarPlay alongside maintenance. [Fuelio](https://www.fuel.io/en-US/features/reminders/) **Decision:** these dilute the maintenance-control job. | Keep a single general expense entry; revisit only if it proves necessary to calculate a planned-service deadline. |
| Cloud account, automatic backup, or cross-device sync | These change the privacy and reliability contract. MemoCar is cloud-backed; АвтоЛог offers export/backup. [MemoCar](https://memocar.ru/), [АвтоЛог](https://play.google.com/store/apps/details?hl=ru&id=net.inettools.autolog) | Be candid that v1 is browser-local; defer to SYNC-01/SYNC-02. |

## Feature Dependencies

```text
Vehicle passport + current mileage
  → maintenance deadline by mileage
  → textual due status / nearest-work overview

Maintenance plan (name + date and/or mileage)
  → due-status calculation
  → empty/overdue dashboard states

Completed work (name + amount + date [+ mileage])
  → service-history item
  → total-expense recalculation

Local persistence + transparent disclosure
  → trustworthy return visits
  → any later export/sync migration path
```

## MVP Recommendation

Prioritize:

1. **Vehicle passport and local-storage disclosure** — establish the single-car context and the honest data boundary (VEH-01, VEH-02).
2. **Maintenance plan plus deterministic due status** — deliver the prevention value before adding reporting (MNT-01–03).
3. **Completed-work history, deletion, and total expenses** — close the service-book loop and make the cost visible (HIS-01–03).
4. **Mobile interaction, accessible urgency, and empty/success/error states** — make the three-step loop usable without instruction (UX-01–04).

Defer: externally verified schedules, documents/OCR, valuation, push notifications, accounts/sync, multiple vehicles, fuel/trips, advanced analytics, and social/family features. Their value is evidenced in broader products, but they require data providers, permissions, background infrastructure, or privacy/data-model work that does not advance this MVP’s core test.

## Sources

- [Drivvo — Vehicle maintenance tracker](https://www.drivvo.com/en/vehicle-maintenance/) — first-party product documentation, crawled 2026-11-09; provider classification LOW.
- [Fuelio — Reminders](https://www.fuel.io/en-US/features/reminders/) — first-party product documentation, crawled 2026-11-09; provider classification LOW.
- [Auto.ru — Garage support / recalls](https://auto.ru/support/recall) — first-party support page, crawled 2026-11-09; provider classification LOW. The Garage landing page redirects to login, so this source supports only the stated vehicle/recall claims.
- [MemoCar](https://memocar.ru/) — first-party Russian competitor page, crawled 2026-11-09; provider classification LOW.
- [АвтоЛог — Google Play listing](https://play.google.com/store/apps/details?hl=ru&id=net.inettools.autolog) — developer-supplied store listing, updated 2026-10-16 and crawled 2026-11-09; provider classification LOW.

## Research Gaps

- No direct interviews or review mining were performed; the “expected” classification is triangulated competitor evidence, not validated demand from АвтоРитм users.
- The research did not test Russian-language wording for overdue status, privacy disclosure, or whether users prefer a date, mileage, or combined plan first. Test those in the 5–7 participant MVP sessions specified by the PRD.
- No licensed source for manufacturer-specific schedules, VIN history, prices, or recall data was verified; these remain intentionally out of scope.
