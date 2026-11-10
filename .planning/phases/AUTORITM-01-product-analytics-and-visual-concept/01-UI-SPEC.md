---
phase: "1"
slug: "product-analytics-and-visual-concept"
status: approved
shadcn_initialized: false
preset: none
created: "2026-11-09"
---

# Phase 1 — UI Design Contract

> Canonical visual and interaction contract for the one-car, browser-local АвтоРитм MVP. It turns UX-01 through UX-04 into an implementable mobile-first reference without adding product scope or claiming user-test findings.

## Scope and sources of truth

This contract applies to the approved loop: **добавить или подтвердить автомобиль → запланировать ТО → записать выполненную работу/расход → проверить, что требует внимания**. It is a calm, assured, practical digital service book—not a marketplace, car catalogue, racing dashboard, or reporting console.

Locked decisions from `01-CONTEXT.md` govern this document. The existing semantic HTML, browser-only `localStorage` boundary, single-column mobile breakpoint, pine/mint palette, and `#car-summary[aria-live="polite"]` are the baseline to evolve. The prototype remains tracking-free and dependency-free; it does not introduce accounts, cloud sync, external vehicle data, notifications, multiple cars, fuel, or a backend.

## Design System

| Property | Value |
|---|---|
| Tool | none — semantic HTML, CSS custom properties, and vanilla JavaScript |
| Preset | not applicable; static HTML/CSS/JS project, not React/Next/Vite |
| Component library | none; compose the documented native patterns |
| Icon library | inline SVG, one 24px outline icon set authored in-repository; do not mix emoji, text glyphs, and line icons |
| Font | system sans-serif: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif` |
| Visual personality | calm, assured, practical; no gradients, glossy widgets, racing imagery, gamification, or decorative stock-car art |

### Component vocabulary

Use the existing `.card`, `.fields`, `.stack`, `.item`, and `.total` vocabulary as the implementation starting point. Components below are patterns, not a package inventory.

| Pattern | Structure and behavior | Mobile rule |
|---|---|---|
| App header | wordmark, compact local-data disclosure, no account or vehicle switcher | 56–64px high; disclosure remains visible as `Данные только на этом устройстве` |
| Section/card | white surface, 1px quiet border, 16px radius, 24px interior padding | 16px page gutters; 16px padding on screens under 380px only if controls retain 44px targets |
| Primary action | full-width button, pine fill, white label, optional trailing 20px SVG arrow | one per screen/state; min-height 44px; never relies on hover |
| Secondary action | text/outlined control with visible label | never competes visually with the primary action |
| Field | persistent Russian label, input, optional unit/help, field-linked error | 44px min control height; numeric inputs invoke a numeric keypad where supported |
| Status card | title, explicit status sentence, 20px icon, optional criterion chips | urgent state uses icon + text + red left rule/badge, never colour alone |
| Item row | title, one-to-two-line metadata, labelled destructive control | title and metadata wrap; delete control is at least 44px wide/high |
| Inline notice | `role=status` success/info or `role=alert` persistent failure | placed after the affected form or before the affected list; never a browser `alert()` |

## Mobile information architecture and happy-path transitions

The future implementation may remain a single page with anchored sections; these are four sequential **screen patterns**, not a mandate to add a router. At every step, the listed primary action is the only visually filled action.

| Pattern | Purpose and required content | Primary action | Transition / resulting focus |
|---|---|---|---|
| 1. `Автомобиль` — first-use passport | Header disclosure; heading `Мой автомобиль`; fields Марка, Модель, Год, Пробег; helper `Данные сохраняются только в этом браузере и на этом устройстве.` | `Сохранить автомобиль` | Valid save → compact success notice naming the car, summary card becomes populated, viewport scrolls to `План обслуживания`; focus stays on success notice only when the user needs confirmation, otherwise moves to `Работа` in the plan form on explicit `Продолжить к плану` action. |
| 2. `План обслуживания` — create a manually entered deadline | Heading `Ближайшие работы`; fields Работа, При пробеге, км, До даты; helper `Укажите дату, пробег или оба критерия. Сверяйте интервалы с руководством автомобиля.` | `Добавить в план` | Valid save → new task appears at the top/earliest-due position as a status card; `role=status` confirms the title and stated criterion; primary action changes to `Записать выполненную работу`. |
| 3. `История и расходы` — log completed work | Heading `Всё, что сделано`; fields Работа или расход, Сумма, Дата, optional Пробег; total appears before the list only after its label is announced in context. | `Добавить запись` | Valid save → record appears first in reverse chronology, total is recomputed from raw entries, and a single status announcement confirms both saved title and new total. Focus returns to `Работа или расход` so another entry is quick to add. |
| 4. `Контроль` — review attention | Dashboard/control card precedes the expense summary: first upcoming/due task, status reason, `Проверить в руководстве автомобиля`; then total and recent history. One car name identifies the context. | `Добавить работу` when nothing is due; `Записать выполненную работу` when a task is due/overdue | Action anchors to the corresponding form and places focus in its first field. No inactive multi-car tabs, disabled upgrade controls, or marketplace cards appear. |

At 320px width, all form field groups stack to one column. At 381–749px, paired date/mileage fields may remain a two-column group only when each usable field width is at least 132px. At 750px and above, a two-column layout may be used, but source order, heading order, and one-primary-action hierarchy do not change.

## Spacing Scale

Declared values (all spacing values are multiples of 4):

| Token | Value | Usage |
|---|---:|---|
| `space-1` | 4px | icon-to-label gap, thin status-rule offset |
| `space-2` | 8px | label-to-input gap, compact row spacing |
| `space-3` | 16px | default card gaps, mobile gutters, list rhythm |
| `space-4` | 24px | card padding, form-group and section gap |
| `space-5` | 32px | mobile section separation |
| `space-6` | 48px | major mobile section separation |
| `space-7` | 64px | desktop major section separation only |

Exceptions: 44px is the minimum actionable control size, not a spacing token. Controls use 8px radius; cards use 16px radius. Do not introduce 10px, 12px, 18px, 20px, 28px, or arbitrary visual gaps.

## Typography

Use exactly four type sizes and two weights. Body copy is never below 16px; labels may use the 14px size but must not use all-caps as their only meaning.

| Role | Size | Weight | Line height | Contract |
|---|---:|---:|---:|---|
| Supporting label / metadata | 14px | 600 | 1.4 | Persistent field labels, section index, storage disclosure, item metadata |
| Body / control label | 16px | 400 | 1.5 | Instructions, input values, helper/error text, primary actions |
| Section heading | 20px | 600 | 1.2 | `Мой автомобиль`, `Ближайшие работы`, `Всё, что сделано` |
| Page/display heading | 28px | 600 | 1.2 | Home/control heading and one-line dashboard prompt |

Numerals, dates, kilometres, and rouble totals use tabular numerals where available. Date copy is human-readable Russian (`До 15 декабря 2026`) in rendered status; an ISO date is not shown as the primary user-facing status. Keep line length around 45–75 characters on wide screens; on mobile, wrap naturally and never truncate a due reason, error, or primary action.

## Colour and contrast contract

The 60/30/10 distribution is a composition guide, not a licence to use low-contrast text. A role can be reduced in area to preserve legibility. All normal-size text and actionable icon-label pairs must meet WCAG AA 4.5:1; UI boundaries and non-text controls must meet 3:1. Focus indicators must remain visible in forced-colors mode.

| Role | Token / value | Allocation and accessible usage |
|---|---|---|
| Dominant canvas (60%) | `--color-page: #F6F8F3` | page background and quiet reading space; ink/error text is readable at 6.15:1 or better |
| Secondary surface (30%) | `--color-surface: #FFFFFF`; `--color-soft-accent: #B5E6C9` | white cards/fields; soft mint only for non-critical supporting panels with pine text (8.64:1) |
| Ink / structure | `--color-ink: #173D33`; `--color-primary: #1D4938` | main text, header structure, primary action; white on primary is 10.18:1 |
| Purposeful accent (10%) | `--color-accent: #43A979`; `--color-accent-foreground: #0B2F21` | positive check surface and small non-urgent marker only; use the dark foreground for text (4.98:1). Accent green on white is only 2.92:1 and therefore is not text, a standalone status dot, or the only boundary. |
| Urgent/error | `--color-danger: #B42318` | due/overdue rule/badge/icon and validation/error text; white on danger is 6.57:1. It is semantic, not the page accent. |
| Quiet border / muted text | `--color-border: #D8E2DA`; `--color-muted: #52685C` | 1px card/field boundaries and secondary copy; do not use pale grey-green text below AA |

Accent is reserved for: the positive saved-check icon and the single primary completion/continue cue in a ready state. It is not a generic link colour, a second primary button, a chart colour, or a replacement for urgency. Due/overdue always uses `#B42318` plus a named text status and an alert-triangle/clock SVG icon; normal upcoming work uses a calendar/odometer SVG plus its complete text sentence.

### Required focus, hover, pressed, and disabled appearance

- Focus: a 3px outside ring in `#0B2F21` with 2px offset; it must not be removed with `outline: none` unless this exact replacement is supplied.
- Hover is optional enhancement only; primary button darkens one step, but mobile/touch states are fully legible without it.
- Pressed controls retain the visible focus ring and 44px target.
- Disabled is permitted only while a synchronous form submission is being processed. Preserve the label and explain why if it persists; do not disable the next task because the car is absent—show the vehicle empty state and action instead.

## Explicit visual states and Russian copywriting

Do not use blocking browser alerts. A field error is inline and linked through `aria-describedby`; a form summary is used only after inline errors. Success is announced only after the browser storage write succeeds. The copy below is the implementation copy unless variable placeholders are shown in braces.

| Situation | Visible treatment | Required Russian copy |
|---|---|---|
| Vehicle empty | empty card, quiet car icon, car form remains available | **`Добавьте автомобиль`** — `Укажите марку, модель, год и текущий пробег. Данные сохраняются только в этом браузере и на этом устройстве.` Primary CTA: `Сохранить автомобиль`. |
| Maintenance empty | empty list below plan form, calendar icon, no fake examples | **`Пока нет запланированных работ`** — `Добавьте первую работу и срок по дате, пробегу или обоим критериям.` Primary CTA: `Добавить в план`. |
| History empty | empty list after total of `0 ₽`, receipt/service icon | **`История пока пуста`** — `После выполненной работы добавьте название, сумму и дату — здесь появится запись.` Primary CTA: `Добавить запись`. |
| Save success | green check plus text notice; non-modal | `Автомобиль {марка} {модель} сохранён.` / `Работа «{название}» добавлена в план.` / `Запись «{название}» сохранена. Всего расходов: {сумма}.` |
| Missing/invalid car field | red border + 20px error icon + field error below the exact input | `Укажите марку.`; `Укажите модель.`; `Введите год от 1950 до 2100.`; `Введите пробег от 0 до 9 999 999 км.` |
| Invalid maintenance plan | field-linked errors; one summary only if two or more errors | `Укажите название работы.`; `Укажите дату, пробег или оба срока.`; `Введите пробег от 0 до 9 999 999 км.` |
| Invalid expense record | field-linked errors | `Укажите название работы или расхода.`; `Введите сумму от 0 ₽.`; `Укажите дату выполнения.`; `Введите пробег от 0 до 9 999 999 км.` |
| Due by mileage | danger status card with odometer + alert-triangle icon and red left rule | **`Срок наступил по пробегу`** — `Нужно было выполнить при {порог} км; текущий пробег: {текущий} км.` Action: `Записать выполненную работу`. |
| Due by date | danger status card with calendar + alert-triangle icon and red left rule | **`Срок наступил по дате`** — `Нужно было выполнить до {дата}.` Action: `Записать выполненную работу`. |
| Due by both | danger status card with both small criterion icons + alert-triangle icon | **`Срок наступил по дате и пробегу`** — `До {дата}; порог {порог} км уже достигнут.` Action: `Записать выполненную работу`. |
| Upcoming by mileage/date | neutral status card, calendar or odometer icon, no red | `Через {N} км` and/or `До {дата}`. If both are set and neither is due, show both sentences; do not invent “recommended”. |
| Storage write failure | persistent error notice after unchanged form; no success feedback and no optimistic list insert | **`Не удалось сохранить данные на этом устройстве.`** — `Проверьте, что в браузере разрешено локальное хранение и есть свободное место, затем повторите попытку. Введённые поля не очищены.` Action: `Повторить сохранение`. |
| Stored-data recovery/load failure | recovery card in place of the affected data, form stays usable | **`Не удалось прочитать сохранённые данные.`** — `Новые записи не будут сохранены поверх старых данных, пока проблема не будет проверена. Проверьте настройки браузера или обратитесь к разработчику.` |
| Delete confirmation | native modal/dialog with item name, destructive red button, quiet cancel | Title: `Удалить запись?` Body: `«{название}» будет удалена из истории и сумма расходов пересчитается.` Actions: `Удалить запись` / `Отмена`. |
| Delete success | status notice and stable list focus | `Запись «{название}» удалена. Всего расходов: {сумма}.` |

Every manual maintenance entry also displays: `Срок задан вами. Сверяйте интервалы с руководством автомобиля.` Never use `рекомендовано производителем`, `заводской регламент`, or an implied automatic maintenance interval.

## Interaction, responsive, and accessibility contract

### Forms and validation

1. Keep native labels programmatically associated with controls; placeholders are examples only, never labels.
2. Validate on submit; after a failed submit, focus the first invalid field, set `aria-invalid="true"`, and connect a concise error element via `aria-describedby`. Clear a field error after the field is valid again.
3. For the cross-field maintenance rule, the form requires a non-empty title and at least one of `dueDate` or `dueMileage`. Place its message after that two-field group and programmatically associate it with both inputs.
4. Preserve valid entries on validation or storage error. On successful save, clear only the form that was saved; the vehicle form remains populated with the saved values.
5. Use `inputmode="numeric"` for mileage/year and `inputmode="decimal"` for amount; display units in the visible label, not only a placeholder.

### Dynamic feedback and focus

- Use one dedicated, visually present `role="status" aria-live="polite" aria-atomic="true"` region near the current section for save, delete, and recomputed-total messages. Do not make the entire card or dynamic list a live region.
- Use a visually present `role="alert"` only for the storage failure that stops persistence. Validation errors receive focus and inline text; do not announce every keystroke through a live region.
- After adding a maintenance task, retain focus on the submit button while the status region announces the result; after adding an expense, return focus to the first field for rapid repeat entry. Do not steal focus when list data changes after initial render.
- On deletion, show the confirmation dialog first. On confirm, restore focus to the next same-list delete control; if none exists, the previous one; if the list became empty, the empty-state primary action. Announce the deletion after focus restoration.
- Semantic order is header → current control/dashboard → vehicle → plan → history. Screen-reader and keyboard sequence must follow visual reading order, even when the desktop grid changes placement.

### Responsive behavior

- Baseline: 320–749px is a single column, 16px outer gutters, 44px minimum targets, and no horizontal page scrolling.
- At 750px+, cards may occupy two columns; the `Контроль` card/status still precedes expense summary in DOM and visual hierarchy.
- Long Russian vehicle names, work titles, dates, amounts, and error guidance wrap within cards; no `text-overflow: ellipsis` for deadlines, notices, errors, or action labels. Break long unspaced user text with `overflow-wrap:anywhere`.
- Lists may grow vertically. Do not put task/history lists inside nested fixed-height scroll containers; page scrolling retains context and avoids focus traps.
- Respect `prefers-reduced-motion`; use no essential animation. Any scroll to the next section is instant or reduced-motion-safe and is paired with focus management.
- Test at 320px, 375px, 390px, 750px, and 1280px; test 200% browser zoom and forced-colors mode. No information, primary action, or error may be clipped.

## UI Considerations

Applicable state considerations resolved: 8 covered, 4 backstop, 0 unresolved.

| Category | Element(s) | Status | Resolution / Reason |
|---|---|---|---|
| empty | Vehicle, maintenance, and history collections | ✅ covered | The three documented empty states render their specified heading, body, and one next action; empty data is never represented by a blank card. |
| loading | Form submit controls | ✅ covered | Submission has a short `Сохраняем…` pending label only while the synchronous persistence attempt is active; no artificial spinner is required for initial local render. |
| error | All forms and storage adapter | ✅ covered | Field validation is inline and storage failure is persistent with retry; neither path clears input or claims success. |
| populated | Car summary, task list, history list, total | ✅ covered | Populated records use the documented card/item patterns; the dashboard puts the next maintenance status before total expenses. |
| partial | Maintenance due criteria and optional expense fields | ✅ covered | A task may contain date, mileage, or both; the visible status names the available/satisfied criterion. Optional mileage is omitted cleanly from a history row. |
| overflow | Task/history collections | 🧪 backstop | Visual test with 20 tasks and 20 history rows proves vertical page growth, readable rows, and no nested clipping or horizontal page scroll. |
| zero-one-many | Task and history collections | ✅ covered | Zero uses empty copy; one uses one item/card; many preserve readable 8px list rhythm and reverse chronology for history. |
| long-text | Vehicle names, maintenance titles, error/notices | 🧪 backstop | Visual test with 80-character Russian and unspaced titles proves natural wrapping/`overflow-wrap:anywhere` without clipping labels, due reasons, or delete controls. |
| empty | Dashboard attention card | ✅ covered | With no tasks, dashboard says `Добавьте первую работу, чтобы увидеть ближайший срок` and links to the plan form. |
| error | Read/hydration failure | 🧪 backstop | Held-out test injects malformed stored JSON and proves recovery copy appears without replacing the payload or rendering a broken/empty misleading dashboard. |
| error | Persistence failure | 🧪 backstop | Held-out test makes `localStorage.setItem` throw and proves no success notice, no new item, preserved values, and the documented retry notice. |
| long-text | Primary/secondary action labels and dynamic Russian dates | ✅ covered | Controls wrap or expand vertically rather than truncate; target remains at least 44px tall. |

## Reference and pattern provenance

Use patterns, not visual branding, from these sources. One source supports each type of decision; no external pattern expands product scope.

| Pattern / decision | Provenance | What is adopted |
|---|---|---|
| One-car trusted service-book entry | [Auto.ru Garage](https://auto.ru/garage/) and `PRD.md` | all vehicle information together and a trustful tone; not VIN, valuation, promotions, or external claims |
| Date-or-mileage maintenance status | [Drivvo maintenance](https://www.drivvo.com/en/vehicle-maintenance/) and `PRD.md` | a manually entered task can be due by either criterion; АвтоРитм’s copy must name the firing reason |
| One clear upcoming/due reminder | [Fuelio reminders](https://www.fuel.io/en-US/features/reminders/) and `PRD.md` | visible immediate next status and non-colour urgency; not push notifications |
| Colour roles, tokens, and one-reference discipline | `Лекция_9_Проектируем_UX_конспект.html` | 60/30/10 role allocation, contrast, one icon family, and copy a pattern rather than a competitor’s branding |
| Happy path, acceptance states, and errors as designed states | `Конспект_Лекция_8.html` | one positive path, clear state transition, specific recovery copy, and testable acceptance observations |
| Local-storage and dynamic accessibility | [MDN Constraint Validation](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Constraint_validation), [MDN Web Storage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API), [W3C ARIA19](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA19), and [WCAG use of color](https://www.w3.org/WAI/WCAG20/Understanding/use-of-color.html) | field-linked validation, honest storage failure, targeted live feedback, and text-plus-icon status |

## Anti-patterns prohibited in this phase

- Do not add inactive multi-car, sync, notification, VIN, OCR/AI, fuel, market-value, or account UI “for later”.
- Do not show manual due dates/mileage as manufacturer-approved or automatic recommendations.
- Do not use a red/green colour, a lone dot, or an icon without its text reason to distinguish maintenance urgency.
- Do not use browser `alert()`, placeholder-only labels, silent local-storage failure, fake loading, or success before persistence succeeds.
- Do not make every button green, add competing filled CTAs, visualise expenses before attention, or bury the local-data boundary in a footer.
- Do not hide urgent details with ellipsis, horizontal card scrollers, hover-only controls, or a desktop-only two-column form.
- Do not use gradients, glass effects, speedometers, racing/checkered motifs, car photography, glossy gauges, charts, gamification, or a marketplace aesthetic.

## UX/usability observation plan — not results

This is a test protocol for 5–7 Russian private car owners matching the target persona. It does **not** assert that any task has already succeeded or that any metric has been achieved. Run against a clickable concept or the refined local prototype with browser storage reset between participants; collect consent before any note or recording and use no third-party tracker, account identifier, or background data collection.

| Task and prompt | Observe / record | Pass observation (not a product KPI) |
|---|---|---|
| `Вы впервые открыли АвтоРитм. Добавьте свой автомобиль и вслух скажите, где будут храниться данные.` | completion without moderator help; time to first save; whether the participant explains browser/device-only storage accurately; wording confusion | Participant finds the single vehicle action, saves all four required values, and can explain the storage boundary in their own words. |
| `Запланируйте замену масла к 95 000 км или до 15 декабря. Что означают сроки?` | whether date/mileage inputs and the “or both” rule are understood; invalid attempts; interpretation of manual versus factory schedule | Participant creates a task and says the deadline was entered by them, not verified by the manufacturer. |
| `Представьте, что срок уже наступил. Что именно произошло и что вы сделаете дальше?` | whether text-plus-icon urgency is noticed; correct explanation of date, mileage, or both; next-action choice | Participant identifies the trigger and chooses to record the completed work without relying solely on colour. |
| `После работы внесите замену масла за 8 500 ₽ и проверьте общие расходы.` | title/amount/date comprehension, reverse-history expectation, total comprehension, friction points | Participant creates the record and locates the updated total and latest item. |
| `Исправьте ошибочную запись.` | recognition of destructive action, confirmation comprehension, focus/feedback after delete | Participant can cancel or confirm deliberately and understands that the total will change. |

Observation sheet fields: participant code (not name), device/browser, task order, completion/help needed, time, misread label, quoted explanation of due status/storage, and design issue. Summarise only observed counts and quotes after sessions; label the small sample as exploratory. Review after every two sessions for safety/comprehension issues, then create an evidence-backed iteration backlog without expanding v1 scope.

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|---|---|---|
| none | none | not applicable — this static project has no shadcn or third-party component registry |

## Phase artifact links

- [DESIGN.md](../../../../DESIGN.md) is the implementation-facing source for colour roles, typography, spacing, components, states, and accessibility.
- [01-UX-FLOW.md](01-UX-FLOW.md) records the four-screen path, transitions, state matrix, and acceptance traceability.
- [01-OBSERVATION-PLAN.md](01-OBSERVATION-PLAN.md) is the only session-ready, consent-first observation template; it contains no user-study results.

## Checker Sign-Off

- [x] Dimension 1 Copywriting: PASS
- [x] Dimension 2 Visuals: PASS
- [x] Dimension 3 Color: PASS
- [x] Dimension 4 Typography: PASS
- [x] Dimension 5 Spacing: PASS
- [x] Dimension 6 Registry Safety: PASS
- [x] Dimension 7 Inventory Provenance: PASS — not applicable because `Tool: none`; Component Inventory intentionally omitted per template

**Approval:** approved on 2026-11-09 after `gsd-ui-checker` validation.

Approval: approved
