# Domain Pitfalls

**Domain:** Local mobile-first car-maintenance journal for one private owner
**Researched:** 2026-11-09

## Critical Pitfalls

### Pitfall 1: Presenting a manual reminder as a verified maintenance recommendation

**What goes wrong:** A user interprets a task named “замена масла” and its due date or mileage as a manufacturer-approved requirement. This is particularly risky when a generic interval ignores the exact model year, engine, transmission, operating conditions, or prior work.

**Why it happens:** Service schedules differ by vehicle and can distinguish normal and severe use. Some manufacturer schedules use “date or mileage, whichever occurs first,” while condition-monitoring systems may behave differently. A generic reminder does not know which rule applies to this car. An official Kia manual is one concrete example of the former; AAA distinguishes mileage-based from condition-based reminder systems. **MEDIUM confidence.**

**Consequences:** Missed or premature service, loss of trust, and an unsafe implication that the product gives technical advice.

**Prevention:** Make all v1 tasks explicitly user-entered. Keep the existing “сверяйте с руководством автомобиля” copy next to the plan form; label the deadline as “ваш срок” rather than “регламент”. When a user enters both criteria, calculate “наступит по первому из критериев” and state which one triggered. Do not prefill intervals, name a service as required, or use language such as “рекомендовано производителем” without a sourced v2 integration that records vehicle variant, source, page/version, retrieval date, applicability conditions, and confidence.

**Detection:** Acceptance test with a made-up task verifies that no screen describes it as factory data. Test date-only, mileage-only, and both-criterion tasks; record whether a participant can explain that the app is a tracker rather than a diagnostic or manufacturer schedule.

### Pitfall 2: Losing the only service history on a shared or cleared browser

**What goes wrong:** The app calls one `localStorage` key its history. Data can disappear after browser/site-data clearing, private browsing ends, a different browser/device is used, storage is evicted under pressure, or another person uses the same browser profile. It also remains readable to anyone with that profile.

**Why it happens:** `localStorage` is origin- and browser-profile-scoped, not an account or backup. Browser-managed storage is best-effort by default; quota writes can throw, private sessions commonly clear their data, and users can clear site data. **MEDIUM confidence.**

**Consequences:** A user cannot recover expense or service records and may believe the product has silently synchronized them. On a family/shared device, vehicle and spending information is exposed.

**Prevention:** State at first save and in the settings/footer: “данные хранятся только в этом браузере на этом устройстве; очистка данных браузера удалит их.” Do not call local storage a backup or synchronization. On every write, catch failure, keep the rendered prior state, and show a persistent recovery message—not a success confirmation. Provide a deliberate local “стереть данные” control only with confirmation; defer export/import or account recovery until their requirements, privacy model and tests exist. Never place secrets in `localStorage` if v2 adds authentication.

**Detection:** Manual matrix: regular vs private window, second browser profile, deliberately blocked storage, quota/write exception, site-data clear, and reload. A save is counted as successful only when a reload returns the new record. Test copy comprehension: users must correctly answer where their data is stored and whether it follows them to another device.

### Pitfall 3: Treating stored JSON and form strings as trustworthy domain data

**What goes wrong:** Invalid or old `autoritm-v1` JSON can be rendered as if it were valid. The current loader only checks that `tasks` and `expenses` are arrays; it does not validate `car`, entry fields, finite amounts, IDs, dates, or a schema version. A malformed cached amount can turn the total into `NaN`, and partially valid records can create misleading deadlines or a broken render.

**Why it happens:** Browser validation protects ordinary interactive submission but not values already in `localStorage`, devtools edits, a future import, or earlier schema formats. Persisting derived display values would add another source of truth.

**Consequences:** Incorrect totals/statuses, crashes on startup, silent record loss during a future migration, and false “saved” confidence.

**Prevention:** Define a versioned raw state schema and validate it at the storage boundary. Accept only trimmed nonempty titles; finite nonnegative numbers; plausible integer year; `YYYY-MM-DD` dates; nonnegative optional mileage; unique IDs; and a task with at least one deadline. Quarantine or skip invalid entries with an explanatory recovery state; never overwrite the original payload until a valid next state has been persisted. Persist only raw vehicle/tasks/expenses; recompute total, sorted history, and status after each confirmed mutation.

**Detection:** Unit tests for invalid JSON, missing arrays, old schema versions, `NaN`/`Infinity`, negative values, duplicate IDs, impossible date strings, partial entries, and a failing `setItem`. Reload test fixtures and assert a usable recovery UI rather than a blank/broken page.

### Pitfall 4: Ambiguous or stale date-and-mileage urgency

**What goes wrong:** A card can be overdue in one dimension while appearing merely upcoming in another, or can say “до даты” without saying which date/time rule applies. The current code displays independent fragments instead of one structured state; it recalculates only when the app renders and relies on an implicitly formatted “today” string.

**Why it happens:** Date and odometer values are different clocks. Odometer data is only as current as the last manual update; calendar dates need an explicit local-calendar-day convention. The phrase “срок наступил” is ambiguous unless the app names the triggering criterion.

**Consequences:** The user may postpone a due task, complete the wrong work, or lose confidence after seeing contradictory text.

**Prevention:** Normalize date values to ISO `YYYY-MM-DD` at input/storage boundaries and compare them to one injected local “today” value. Treat both criteria independently: a task is due if **either** configured criterion is reached; show “срок наступил по пробегу”, “...по дате”, or “...по дате и пробегу”. If vehicle mileage is absent/stale, say “обновите текущий пробег для проверки срока” rather than calculate a false remaining distance. Do not promise background reminders—v1 checks status when the app opens.

**Detection:** Deterministic selector tests across timezone/date rollover and all combinations: no criterion, date only, mileage only, both, equality boundary, one overdue/one future, invalid values, and no current car. Usability test asks users what action each resulting status requires.

### Pitfall 5: Expanding into AI/OCR or “smart” claims without a verification loop

**What goes wrong:** A receipt or work order is presented as automatically recognized, and extracted work, amount, date, or mileage is written directly into history. The UI may also imply that an AI has checked vehicle compatibility or the correctness of the work.

**Why it happens:** OCR accuracy varies with image quality, layout, handwriting, language and source quality. NIST guidance describes human correction after initial OCR input; it does not support unattended correctness. **MEDIUM confidence.**

**Consequences:** A wrong expense total or service record becomes hard to notice, and the product gains misleading technical authority.

**Prevention:** Keep OCR/AI absent from v1 as the PRD requires. For a future phase, upload only with explicit consent; preserve the original file and provider/model/version; show every extracted field as an editable, unconfirmed draft; require user confirmation before it enters totals/history; display confidence and extraction failures; and never infer a manufacturer schedule or repair need from OCR alone.

**Detection:** Seed evaluation with Russian receipts/order forms across photo quality, layouts, handwriting and edge values (decimal comma, dates, mileage). Measure per-field accuracy and the rate at which users correct errors before any release claim. Compliance review rejects any copy that says “verified” without a named source and verification process.

## Moderate Pitfalls

### Pitfall 1: Form errors are blocking, vague, or miss cross-field rules

**What goes wrong:** `alert()` interrupts input and does not associate an error with a field. Native `required`/`min` handling does not express “at least one of date or mileage,” and the current handler does not explicitly validate a finite amount, date consistency, or plausible vehicle year after parsing.

**Prevention:** Retain native HTML constraints and add `setCustomValidity()` for cross-field rules, clearing it as soon as the condition is corrected. Put short Russian error text next to/associated with the affected field (`aria-describedby`, `aria-invalid`), use `reportValidity()` on submit, and reserve a pre-existing `role="alert"` live region for a rare critical save failure. Current W3C/MDN guidance supports explicit text identification and live-region notification. **MEDIUM confidence.**

### Pitfall 2: Color is the only urgency signal

**What goes wrong:** A future design may render an urgent due card only in red/orange. Users with limited color perception, monochrome displays, glare, or low contrast then cannot distinguish urgency.

**Prevention:** Each urgency card needs a text status plus an icon/shape and adequate contrast; color may reinforce it but never carry the meaning alone. Check both default and high-contrast/forced-color views. This follows WCAG’s use-of-color guidance. **MEDIUM confidence.**

### Pitfall 3: History order and total drift after mutations

**What goes wrong:** The current history is reverse insertion order, not necessarily reverse chronological order required by HIS-02; a backdated receipt is placed incorrectly. Storing or patching totals/card text separately would make an add/delete leave conflicting values.

**Prevention:** Sort a copy by normalized service date descending with a deterministic `createdAt` tie-breaker, and derive the finite-money total from the raw array on every successful state transition. Test add, backdate, delete-first, delete-last, retry-after-write-error, and reload.

### Pitfall 4: Accidental destructive deletion and lost keyboard focus

**What goes wrong:** One tap on `×` permanently removes a local-only record; after deletion the focused button disappears, leaving keyboard/screen-reader users without a predictable next target.

**Prevention:** Use a visibly named delete action, confirm or offer a short undo before committing, announce the actual successful deletion via `role="status"`, and move focus to the next/previous delete action or the empty-state heading. Do not announce ordinary success with assertive alerts.

### Pitfall 5: Input units and Russian number/date conventions are unclear

**What goes wrong:** A user enters an interval rather than an absolute odometer reading, confuses ₽ with thousands separator/decimal comma, or interprets raw ISO dates as a local date. This creates plausible-looking but wrong records.

**Prevention:** Label due mileage “при общем пробеге автомобиля, км” and remaining distance separately; show formatted examples; display saved dates in a Russian human-readable form while retaining ISO internally; and explain that sum is a positive amount in rubles. Validate integer odometer/year and finite nonnegative two-decimal currency before storage.

## Minor Pitfalls

### Pitfall 1: Quiet data overwrite when editing the vehicle

**What goes wrong:** Changing current mileage may immediately change every deadline, but the user receives only a generic confirmation.

**Prevention:** After vehicle save, report how many planned works changed state and offer an obvious review of the plan. Do not modify prior history mileage automatically.

### Pitfall 2: Scope creep dilutes the validated path

**What goes wrong:** VIN reports, fuel, multi-car management, valuations, reminders, or a backend are added before the sequence vehicle → plan → completed work is reliable.

**Prevention:** Keep v1 to one vehicle and manual facts. Gate every v2 integration behind source/provenance, consent/privacy, failure-state and acceptance-test decisions; do not represent a placeholder as a functioning feature.

### Pitfall 3: “Saved” feedback before persistence succeeds

**What goes wrong:** UI changes or success copy can be shown even if browser storage rejects the write, especially after refactoring individual handlers.

**Prevention:** Centralize mutations: validate → form next state → attempt persistence → replace in-memory state → render derived view → announce success. On failure leave the previous state visible, retain input for retry where safe, and provide an actionable storage-error message.

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Local state and migration | Unvalidated `autoritm-v1` becomes a permanent opaque snapshot. | Add `schemaVersion`, parser/validator, one persistence gateway, recovery UI, and fixture tests before visual polish depends on it. |
| Deadline selector | Date and mileage are merged into a vague sentence or one overwrites the other. | Implement one pure selector with `date`, `mileage`, and `both` reasons; unit-test equality and “whichever occurs first.” |
| Forms and mobile UX | A native alert hides what to fix and a small form invites wrong units. | Use labeled inputs, native limits plus cross-field validity, inline text errors, mobile keyboard checks, and a single next action. |
| Accessibility states | Urgency is encoded by color; dynamic saves/deletes are silent to assistive technology. | Use text/icon/contrast, persistent `status` and rare `alert` regions, semantic lists, and focus restoration after delete. |
| Trusted-data v2 | External schedule/OCR/AI output is written as fact. | Require source/provenance, applicability, editable confirmation, error states, evaluation data and legal/privacy review before implementation. |
| Continuity v2 | “Export” is marketed as sync or import corrupts the local journal. | Specify backup semantics, validation/migration, duplicate/conflict behavior and restore tests before release. |

## Sources

- [MDN — Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) — MEDIUM confidence (official platform documentation; browser-local scope and synchronous API).
- [MDN — Storage quotas and eviction criteria](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria) — MEDIUM confidence (official platform documentation; quota errors, private browsing, and eviction behavior).
- [MDN — Constraint validation](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Constraint_validation) — MEDIUM confidence (official platform documentation; native and custom validation).
- [W3C — Understanding Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification) and [ARIA19 live-region technique](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA19) — MEDIUM confidence (current accessibility guidance).
- [W3C — Understanding Use of Color](https://www.w3.org/WAI/WCAG20/Understanding/use-of-color.html) — MEDIUM confidence (WCAG success-criterion guidance).
- [Kia owners manual — service frequency](https://ownersmanual.kia.com/full_webhelp/CL4/2025/en_CA/topics/chapter8_4.html) and [AAA — maintenance reminders](https://www.aaa.com/AAA/common/AAR/files/Maintenance-Reminders.pdf) — MEDIUM confidence (official/industry examples; not a universal schedule).
- [NIST — OCR system design and evaluation](https://nvlpubs.nist.gov/nistpubs/Legacy/IR/nistir5932.pdf) — MEDIUM confidence (human correction after initial recognition; applies to a future OCR workflow).
- Codebase review: `app.js`, `index.html`, `PRD.md`, and `.planning/REQUIREMENTS.md` — HIGH confidence for current implementation and agreed MVP boundaries.
- Product judgments are marked as prevention recommendations; no unsupported claim treats an AI/OCR, VIN, schedule, valuation, sync, or notification integration as available.
