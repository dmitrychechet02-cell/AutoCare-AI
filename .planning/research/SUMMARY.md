# Project Research Summary

**Project:** АвтоРитм  
**Domain:** local-first mobile web service book for one private car in Russia  
**Researched:** 2026-11-09  
**Confidence:** MEDIUM

## Executive Summary

АвтоРитм — учебный mobile-first веб-прототип спокойной личной сервисной книжки: владелец вручную фиксирует один автомобиль, планирует работу по дате и/или пробегу, сохраняет выполненные работы и видит ближайший срок и общие расходы. Категория подтверждает эту базовую петлю, но не требует конкурировать с экосистемами VIN-данных, оценок, топлива или автопарков. Для первой версии источником истины остаётся ручной ввод, а срок обслуживания должен быть явно представлен как введённый пользователем, а не как рекомендация производителя.

Рекомендуемый путь — сохранить работающий статический HTML/CSS/JavaScript MVP без зависимостей и сделать его надёжной, проверяемой локальной системой. Сначала закрепить UX и визуальную концепцию в UX/UI/DESIGN-артефактах, затем внедрять её вместе с единым состоянием, валидируемой версией JSON и одним шлюзом записи в `localStorage`. Это даёт продуктовому исследованию реальный, наблюдаемый сценарий без дорогой миграции на фреймворк или бэкенд.

Главные риски — ложное впечатление о заводском регламенте, потеря локальных данных, некорректная обработка старого JSON и неоднозначный статус при двух критериях срока. Они снимаются честной копией о границах данных, проверкой состояния на границе хранилища, детерминированными selector-ами срока и доступными состояниями интерфейса. OCR, AI, VIN-данные, push, облачная синхронизация и несколько автомобилей остаются строго за пределами v1.

## Key Findings

### Recommended Stack

Существующий стек полностью покрывает утверждённый v1. Нулевая зависимость важнее технологической «современности»: продукт состоит из одного мобильного пути и не имеет требований к маршрутизации, совместной работе или серверным секретам. Ближайшее техническое вложение — качество локального состояния и UX, а не переписывание на React/Vue или подключение БД.

**Core technologies:**

- **Semantic HTML5 forms + Constraint Validation API**: сбор и первичная проверка данных — дают понятные mobile-native поля; для правила «дата или пробег» добавить `setCustomValidity()` и связанные текстовые ошибки.
- **CSS custom properties and media queries**: визуальная система — сохранить mobile-first одноэкранный интерфейс, закрепив токены цвета, типографики, отступов, фокуса и срочности в `DESIGN.md` и CSS.
- **Vanilla browser JavaScript**: controller, selectors, rendering and validation — оставить без фреймворка; разделить ответственности логически, когда это улучшает тестируемость.
- **Versioned JSON state in `localStorage`**: компактное local-first хранение — добавить `schemaVersion`, parser/validator, миграцию известных схем и единый `commit()`/persistence gate.
- **`Intl.NumberFormat('ru-RU')`**: локализованные рубли и километры — уже соответствует российской аудитории.
- **Static HTTP/HTTPS hosting**: стабильное окружение — тестировать через `localhost`, а перед beta закрепить один HTTPS origin; `file:` не является надёжным контрактом для storage.

Критический предел версии: пока v1 хранит только небольшой текстовый журнал, `localStorage` достаточен. IndexedDB нужен лишь при файлах/крупной офлайн-истории; PostgreSQL, object storage, OIDC и серверный API — единый будущий вертикальный срез для accounts/sync/OCR, а не постепенное усложнение v1.

### Expected Features

**Must have (table stakes):**

- Паспорт одного автомобиля: марка, модель, год и текущий пробег; локальное хранение объяснено до/при сохранении.
- Ручной план работы с названием и хотя бы одним критерием: дата, общий пробег или оба.
- Текстовый, иконографический и доступный статус срока; при двух критериях он называет сработавшую причину.
- Внесение выполненной работы/расхода: название, сумма, дата, опциональный пробег.
- Обратная хронология с корректируемым удалением и пересчёт общего расхода только из сырых записей.
- Явные пустые, ошибочные, сохранённые и срочные состояния на мобильном экране.

**Should have (competitive):**

- Один обзор «что требует внимания сейчас»: ближайшая работа, просрочки и общий расход, без добавления нового источника данных.
- Прозрачное объяснение «ваш срок» и логики «что наступит раньше».
- Спокойная, доступная, one-hand mobile UX-концепция с одним очевидным следующим действием и без аккаунта.

**Defer (v2+):**

- Заводские регламенты, VIN/отзывные кампании, оценка автомобиля и любые утверждения на внешних данных.
- OCR/AI/голосовой ввод чеков: только через сервер, consent, provenance и обязательное подтверждение черновика.
- Push-уведомления, PWA offline shell, учётные записи, backup/sync, multi-car/family/fleet, fuel/trips и расширенная аналитика.

### Architecture Approach

Архитектура v1 должна остаться browser-only: HTML задаёт семантические области и формы; controller нормализует пользовательский ввод; state functions валидируют и строят следующий `AppState`; единственный storage adapter сохраняет снимок; чистые selectors выводят статус ТО, сортированную историю и сумму; renderer строит управляемые DOM-области через безопасный текстовый вывод. DOM и производные значения не являются источником истины.

**Major components:**

1. **Vehicle, maintenance and expense forms** — собирают данные и показывают поля/межполевые ошибки рядом с контролами.
2. **State store + commands/reducer** — хранит `vehicle`, `tasks`, `expenses`; принимает только валидные команды и заменяет состояние лишь после успешного persistence.
3. **Storage adapter** — hydrate, schema validation/migration and guarded `localStorage` write; показывает recovery UI, не изображая ошибку как успех.
4. **Selectors** — вычисляют due reason (`date`, `mileage`, `both`), history order and total from raw records; не сохраняют вычисленное.
5. **Renderer + StatusAnnouncer** — отображают карточки, списки и design tokens; используют `role=status` для успеха, `role=alert` только для критической ошибки и восстанавливают фокус после удаления.

### Critical Pitfalls

1. **Ручной срок выглядит как заводская рекомендация** — называть его пользовательским, сохранять предупреждение о руководстве автомобиля и не предзаполнять интервалы без лицензированного источника и provenance.
2. **Локальная история теряется или ошибочно воспринимается как sync** — чётко сообщать browser/device boundary; ловить write-failure, не показывать успех до reload-safe записи и не обещать backup.
3. **Повреждённый или старый JSON ломает доверие и экран** — ввести `schemaVersion`, строгую проверку сущностей, quarantine/recovery UI и не перезаписывать исходный payload до подтверждённого save.
4. **Дата и пробег дают противоречивую срочность** — один pure selector сравнивает нормализованные ISO-даты и пробег, срабатывает по любому критерию и называет причину.
5. **Визуальная полировка ухудшает доступность или ввод** — status не кодируется одним цветом; полевые ошибки, live regions, ясные единицы и возврат фокуса обязательны в design contract и UAT.

## Implications for Roadmap

Based on the research, suggested phase structure:

### Phase 1: Product analytics and visual concept foundation

**Rationale:** Непосредственная цель — продуктовая аналитика и визуальная концепция, а рабочий static MVP уже доказывает базовую реализуемость. До структурных изменений нужно зафиксировать, как пользователь проходит happy path и как каждая data/urgency state выглядит и объясняется.

**Delivers:** UX-flow и сценарий проверки с 5–7 участниками; `DESIGN.md` с mobile-first токенами, типографикой, компонентами, контрастом и состояниями; UI-spec/wireframes или mockups ключевых экранов; analytics/event plan для прохождения «автомобиль → план → расход → контроль»; трассировка UX-01–UX-04 к текущему прототипу без смены стека.

**Addresses:** UX-01–UX-04; дифференциатор «что требует внимания сейчас»; понятная локальная граница и объяснение срока.

**Avoids:** Добавление новых интеграций ради макета, цвет как единственный сигнал, рекламный/клубный интерфейс и выдачу ручного срока за регламент.

### Phase 2: Trustworthy local state and deterministic maintenance logic

**Rationale:** Визуальный слой должен опираться на корректные данные. Schema/persistence и selector срока — общая зависимость для всех надёжных карточек, итогов и тестов.

**Delivers:** Версионированный `AppState`; parser/validator and recovery state; один persistence gate with failure handling; normalized date/number inputs; due selector with reason; raw-state-derived sorted history and total; unit/fixture tests for corruption, boundary and failed-write cases.

**Addresses:** VEH-01–02, MNT-01–03, HIS-01–03 в их data-integrity части.

**Uses:** Vanilla JS, `localStorage`, semantic forms and `Intl`; no dependency or backend.

**Avoids:** Silent data loss, `NaN` totals, stale/ambiguous deadlines and false saved feedback.

### Phase 3: Accessible mobile workflow implementation

**Rationale:** После фиксации design contract и state boundary безопасно применить визуальную концепцию к работающему пути, не создавая разрыв между демонстрационным UI и логикой.

**Delivers:** Mobile-first implementation of vehicle, maintenance, dashboard and expense/history views; labelled inputs and inline cross-field errors; empty/success/storage-error states; urgency text + icon + contrast; live announcements; destructive-delete confirmation/undo direction and focus restoration; manual mobile/keyboard/screen-reader QA.

**Addresses:** Полный v1 path and UX-01–UX-04, including the one-action dashboard and transparent deadline explanation.

**Avoids:** Blocking `alert()` flow, unclear mileage/currency units, colour-only urgency, inaccessible dynamic updates and history-order/summary drift.

### Phase 4: Usability validation and local-product readiness

**Rationale:** Учебный MVP следует оценивать наблюдением, а не имитацией рыночных метрик. После реализации можно проверить, понятен ли пользователям именно обещанный контролирующий контур.

**Delivers:** Moderated/unmoderated 5–7 participant test protocol, event capture/observation sheet, results synthesis and prioritised iteration backlog; storage-boundary and destructive-action comprehension checks; localhost/one-origin deployment verification.

**Addresses:** Product success metric: без подсказки создать автомобиль, запланировать ТО и внести расход; проверка понимания «срок наступил» и следующего действия.

**Avoids:** Treating competitor patterns as validated demand, claiming analytics findings without evidence and widening scope before the main loop is usable.

### Phase Ordering Rationale

- Phase 1 preserves the working static MVP while converting product intent into testable UX, UI, DESIGN and analytics artifacts; it supplies the acceptance contract for implementation rather than a speculative redesign.
- Phase 2 precedes UI integration because every visual state depends on trusted raw data, a successful persistence commit and one deadline calculation.
- Phase 3 groups all user-facing forms, overview and accessibility states around a single state/rendering model, preventing component-specific mutation logic and inconsistent copy.
- Phase 4 validates the complete loop with the stated audience before any v2 capability. External data, OCR, sync or notifications are separate product bets, not Phase 5 defaults.

### Research Flags

Phases likely needing deeper research during planning:

- **Phase 1:** Run design/UX research from the cited lecture materials and validate Russian wording, visual concepts and analytics-event privacy before settling the artifacts.
- **Phase 4:** Research/test methodology is required to recruit representative Russian private owners and define observation consent, task scripts and success thresholds.
- **Any v2 trusted-data/OCR/sync phase:** Mandatory new research for licensed providers, vehicle applicability, Russian data/privacy terms, representative receipt sets, security, retention, migration and conflict handling.

Phases with standard patterns (skip research-phase):

- **Phase 2:** Standard browser validation, versioned local state, selectors and failure handling are well documented by MDN/W3C; use the research as the implementation contract.
- **Phase 3:** Semantic forms, responsive CSS, non-colour status cues, live regions and focus management are established patterns; plan directly against the existing DESIGN/UX artifacts.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | MEDIUM | Current no-dependency MVP is directly verified; browser/storage and security evolution are supported by MDN/OWASP but need target-device testing. |
| Features | LOW | Competitor pages triangulate category patterns, but there were no direct interviews, review mining or demand tests with target users. |
| Architecture | MEDIUM | Repository evidence validates the current shape; recommended storage/accessibility patterns use official MDN/W3C guidance. |
| Pitfalls | MEDIUM | Based on code/requirements and official platform/accessibility references; severity is still an informed product judgment. |

**Overall confidence:** MEDIUM

### Gaps to Address

- **User evidence:** Validate labels, deadlines, onboarding disclosure and dashboard hierarchy with the planned 5–7 participants; do not promote competitor evidence to proof of demand.
- **Design source material:** Phase 1 must turn the UX lecture guidance into concrete, reviewable `DESIGN.md`/UI artifacts and check the existing dark-pine/light-surface/mint direction for contrast and mobile legibility.
- **Analytics governance:** Define the minimum event set, whether it is observation-only or instrumented, storage/retention and participant consent; the local MVP must not quietly introduce third-party tracking.
- **Persistence continuity:** Decide only after usability evidence whether export/import is needed; if approved, specify backup semantics, schema validation, duplicate rules and restore tests before implementation.
- **External data:** No verified manufacturer schedule, VIN, valuation or recall supplier exists. Each needs separate provider, licence, applicability, provenance and privacy research before appearing on a roadmap.
- **Mobile/browser compatibility:** Test `localStorage`, dates, numeric keyboard, forced colours and assistive flows on the actual mobile browsers used by participants.

## Sources

### Primary (HIGH confidence)

- [`PRD.md`](../../PRD.md) — target persona, scope, happy path, acceptance criteria and usability measures.
- [`PROJECT.md`](../PROJECT.md) and [`REQUIREMENTS.md`](../REQUIREMENTS.md) — approved constraints and v1 requirement traceability.
- [`STACK.md`](STACK.md), [`ARCHITECTURE.md`](ARCHITECTURE.md) and [`PITFALLS.md`](PITFALLS.md) — repository-backed analysis of the current static MVP.

### Secondary (MEDIUM confidence)

- [MDN — Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API), [storage quotas and eviction](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria), and [constraint validation](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Constraint_validation) — local persistence and form behavior.
- [W3C ARIA19](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA19), [WAI-ARIA status/alert](https://www.w3.org/TR/wai-aria/states_and_properties), and [WCAG use of color](https://www.w3.org/WAI/WCAG20/Understanding/use-of-color.html) — accessible dynamic feedback and urgency.
- [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html), [Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html), and [File Upload](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html) — guardrails for deferred account/OCR work.
- [Kia owner manual](https://ownersmanual.kia.com/full_webhelp/CL4/2025/en_CA/topics/chapter8_4.html), [AAA maintenance reminders](https://www.aaa.com/AAA/common/AAR/files/Maintenance-Reminders.pdf), and [NIST OCR guidance](https://nvlpubs.nist.gov/nistpubs/Legacy/IR/nistir5932.pdf) — limits of generic service advice and unconfirmed OCR.

### Tertiary (LOW confidence)

- [Drivvo](https://www.drivvo.com/en/vehicle-maintenance/), [Fuelio](https://www.fuel.io/en-US/features/reminders/), [MemoCar](https://memocar.ru/), [АвтоЛог](https://play.google.com/store/apps/details?hl=ru&id=net.inettools.autolog), and [Auto.ru Garage support](https://auto.ru/support/recall) — competitor-reported category patterns, not user research.

---
*Research completed: 2026-11-09*  
*Ready for roadmap: yes*
