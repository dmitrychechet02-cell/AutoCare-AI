# Architecture Patterns

**Domain:** Локальная mobile-first сервисная книжка для одного автомобиля  
**Researched:** 2026-11-09  
**Confidence:** MEDIUM — выводы о текущей реализации проверены в коде; рекомендации по Web Storage и доступным сообщениям сверены с MDN и W3C.

## Recommended Architecture

Для v1 сохранить **статическое browser-only приложение без сервера и внешних интеграций**. Нынешний прототип уже следует этому контуру: `index.html` задаёт семантический каркас и формы, `app.js` держит единственный объект состояния и сериализует его в `localStorage`, `styles.css` задаёт адаптивную визуальную систему. Это верная граница для одного автомобиля и ручного ввода; аккаунты, API, синхронизация, VIN, OCR, цены и push-уведомления не нужны для выполнения требований v1.

Следующий безопасный шаг — не добавлять фреймворк, а разбить `app.js` на небольшие логические модули (они могут остаться в одном подключаемом файле до появления реальной сложности):

```text
HTML: семантические секции и формы
  │ DOM-события / native form constraints
  ▼
Controller: нормализация ввода + явные пользовательские команды
  ▼
State functions: validate → reduce → persist
  │                         │
  │                         └── AppState (единственный источник истины)
  ▼
localStorage adapter        selectors / derived state
  │                         │
  └────── hydrate/save ─────┴──► Renderer: карточки, списки, summary, status
                                      │
                                      └── CSS design tokens + responsive layout
```

Важная граница: DOM не является хранилищем данных. Формы — только временный ввод, `AppState` — данные пользователя, а `localStorage` — локальный снимок этого состояния. Все вычисления (срочность ТО, общий расход, порядок истории, пустые состояния) выводятся из `AppState` при рендеринге, а не сохраняются отдельными полями. Это не позволит «протухшим» итогам или статусам стать источником истины.

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `VehicleForm` | Собирает паспорт единственного автомобиля; показывает локальные ошибки и подтверждение сохранения. | `vehicle` command, validation, `StatusAnnouncer` |
| `MaintenanceForm` | Принимает название и хотя бы один из сроков: дата, пробег или оба. | `addTask` command, validation |
| `MaintenanceList` | Отображает план и текстовый/иконографический статус срока; удаляет запись через команду. | `maintenanceStatus` selector, `deleteTask` command |
| `ExpenseForm` | Принимает выполненную работу/расход, сумму, дату и необязательный пробег. | `addExpense` command, validation |
| `ExpenseList` and `CostSummary` | Показывают историю в обратной хронологии и итог, полученный из записей. | `sortedExpenses` and `totalCost` selectors |
| `State store` | Хранит нормализованный `AppState`; применяет команды иммутабельно и инициирует рендер. | Forms, selectors, persistence adapter |
| `Storage adapter` | Загружает, проверяет/мигрирует и атомарно перезаписывает один ключ `autoritm-v1`; сообщает о недоступности или ошибке записи. | State store, `localStorage` |
| `StatusAnnouncer` | Единообразно сообщает о сохранении, удалении и ошибке; не смешивается с данными предметной области. | All controllers, dedicated live regions |
| `Renderer` | Меняет только управляемые области DOM через `replaceChildren`/создание узлов и не вставляет пользовательские строки через `innerHTML`. | Selectors, state subscription |

### State and Storage Model

Схема должна быть версионируемой и валидироваться при чтении. Все числовые значения лучше привести к числу на границе формы, а не сохранять строки `FormData`; даты оставлять в ISO-формате `YYYY-MM-DD`, чтобы их можно было сравнивать без неявного преобразования часового пояса.

```ts
type Vehicle = {
  make: string;
  model: string;
  year: number;
  mileage: number;
  modification?: string;
  region?: string;
};

type MaintenanceTask = {
  id: string;
  title: string;
  dueMileage?: number;
  dueDate?: string; // YYYY-MM-DD
  createdAt: string;
};

type Expense = {
  id: string;
  title: string;
  amount: number;
  date: string; // YYYY-MM-DD
  mileage?: number;
  createdAt: string;
};

type AppState = {
  schemaVersion: 1;
  vehicle: Vehicle | null;
  tasks: MaintenanceTask[];
  expenses: Expense[];
};
```

`localStorage` остаётся достаточным для текстовых записей и небольшого объёма v1, но это синхронный API и доступ/запись могут завершиться ошибкой из-за настроек приватности или исчерпания места. Поэтому `load()` возвращает безопасное начальное состояние при повреждённом JSON, а `save(next)` выполняется в `try/catch`, **не** заменяет состояние в памяти, пока запись не подтвердилась, и публикует понятную ошибку в интерфейсе. Не обещать пользователю резервное копирование: данные принадлежат текущему origin/browser/device и могут быть очищены браузером. [MDN: Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API), [MDN: quotas and eviction](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria) — MEDIUM confidence.

Необходимые инварианты:

- `vehicle` либо `null`, либо имеет непустые `make`/`model`, целые `year` и неотрицательный `mileage`.
- У задачи есть `id`, непустой заголовок и хотя бы один срок; `dueMileage` и `dueDate` независимы, если заданы оба — показываются оба, а статус «срочно» наступает при любом просроченном критерии.
- У расхода есть `id`, непустой заголовок, конечная неотрицательная сумма и корректная дата; необязательный пробег также неотрицателен.
- `totalCost`, упорядоченная история и текст статуса ТО никогда не сохраняются: это производные селекторы.
- Неизвестная или старая схема не должна аварийно ломать экран: адаптер мигрирует известную прежнюю схему либо открывает пустое состояние с объяснением, не перезаписывая исходные данные до успешного сохранения.

### Data Flow

1. При загрузке `StorageAdapter.load()` читает только ключ приложения, разбирает JSON, проверяет схему и выдаёт `AppState` либо чистое состояние. Затем `render(select(state))` заполняет форму автомобиля, план, историю, итог и пустые состояния.
2. При отправке формы браузер сначала применяет встроенные `required`, `min`, `max`, `type=date` ограничения. Контроллер читает данные, `trim()`-ит строки, приводит числа и применяет межполевые правила: у задачи есть срок, у расхода есть валидная сумма/дата.
3. Валидная команда (`saveVehicle`, `addTask`, `addExpense`, `deleteTask`, `deleteExpense`) порождает следующий объект состояния. `persist(next)` пытается сохранить его; только успех коммитит состояние, запускает рендер и вежливо сообщает результат.
4. Для ТО selector получает текущий пробег автомобиля и дату «сегодня», затем возвращает структурированный результат: `overdue | upcoming | unscheduled-context`, текст и причину (`mileage`, `date`, `both`). Представление использует этот результат для текста, иконки и класса, а не вычисляет правила повторно.
5. Для расходов selector сортирует копию по дате по убыванию (а при равной дате — по `createdAt`) и суммирует конечные суммы. Удаление снова проходит полный путь command → persist → render, так что карточки и итог не расходятся.

### UX and Accessibility State Model

Визуальный концепт должен моделировать состояния явно — не только «показать красивую карточку». Для каждой области определены данные, действие, текстовый результат и доступное уведомление.

| Area | States | Required UI behavior |
|------|--------|----------------------|
| Vehicle | `empty`, `editing`, `invalid`, `saving`, `saved`, `storage-error` | Пустое объяснение и один CTA; полевые ошибки рядом с контролом; после успеха — неизменяемое резюме и `role=status` сообщение. |
| Maintenance | `empty`, `draft-invalid`, `upcoming`, `due`, `overdue`, `storage-error` | Список всегда объясняет статус текстом: «через N км», «до ДД.ММ.ГГГГ», «срок наступил»; иконка/форма усиливает, но не заменяет текст. |
| Expenses | `empty`, `draft-invalid`, `populated`, `deleting`, `storage-error` | История отсортирована и имеет доступное имя кнопки удаления; итог меняется только после успешного сохранения. |
| App | `hydrating`, `ready`, `recoverable-storage-error`, `invalid-stored-data` | Ни один сбой localStorage не должен выглядеть как успешное сохранение; ошибки дают следующее действие («проверьте настройки браузера/освободите место»). |

Использовать нативные `label` и HTML-ограничения как сейчас, дополнив их русскими связанными сообщениями (`aria-describedby`, `aria-invalid="true"`) для межполевых правил. Встроенный Constraint Validation API поддерживает такие проверки и `setCustomValidity()`/`reportValidity()` для понятного сценария отправки. [MDN: Constraint Validation](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Constraint_validation) — MEDIUM confidence.

Создать в разметке до начала взаимодействия два отдельных контейнера: ненавязчивый `role="status" aria-live="polite"` для «сохранено/удалено» и `role="alert"` только для критической ошибки сохранения или отправки. W3C рекомендует live region, присутствующий до динамического обновления, для уведомления assistive technology; `alert` прерывает пользователя и потому не годится для обычных успехов. [W3C ARIA19](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA19), [WAI-ARIA status/alert](https://www.w3.org/TR/wai-aria/states_and_properties) — MEDIUM confidence.

Списки работ и расходов следует выразить как `<ul>`/`<li>` или эквивалентные семантические группы с видимым заголовком. После удаления не оставлять клавиатурный фокус на исчезнувшей кнопке: переводить его на следующую кнопку удаления, предыдущую при удалении последней, либо на заголовок пустого состояния. Пользовательские названия продолжают добавляться через `textContent`, что сохраняет эту границу без необходимости HTML-санитизации.

## Patterns to Follow

### Pattern 1: Command + reducer + one persistence gate

**What:** Представлять действия пользователя небольшими командами и хранить запись `localStorage` в одном шлюзе, а не вызывать `localStorage.setItem()` из каждой формы или обработчика удаления.

**When:** Для всех мутаций v1: автомобиль, план, расходы, удаление и будущая миграция формата.

**Example:**

```typescript
function commit(command: Command) {
  const next = reduce(state, command);
  const validation = validateState(next);
  if (!validation.ok) return showFieldErrors(validation.errors);

  if (!storage.save(next)) {
    return announceError('Не удалось сохранить данные на этом устройстве.');
  }

  state = next;
  render(selectView(state));
  announceStatus(command.type === 'DELETE_EXPENSE' ? 'Запись удалена.' : 'Данные сохранены.');
}
```

Преимущество для дизайна: любой экран может быть протестирован на чистом `AppState`, а сообщение «сохранено» истинно только после успешной записи.

### Pattern 2: Derived deadline selector

**What:** Один чистый selector вычисляет статус ТО по независимым срокам даты и пробега.

**When:** Карточка ближайшей работы, будущие сводки и пустые/срочные состояния.

**Example:**

```typescript
function maintenanceStatus(task: MaintenanceTask, vehicle: Vehicle | null, today: string) {
  const mileageOverdue = vehicle && task.dueMileage !== undefined
    ? task.dueMileage <= vehicle.mileage
    : false;
  const dateOverdue = task.dueDate !== undefined ? task.dueDate <= today : false;

  if (mileageOverdue || dateOverdue) {
    return { tone: 'urgent', reason: mileageOverdue && dateOverdue ? 'both' : mileageOverdue ? 'mileage' : 'date' };
  }
  return { tone: 'normal', reason: 'upcoming' };
}
```

Сравнение допустимо только с нормализованной ISO-датой и числом. Представление локализует результат для пользователя, но не меняет правила.

### Pattern 3: Progressive enhancement of the current static page

**What:** Оставить обычные HTML-формы и расширять только интерактивность; не превращать UX-концепт в SPA, не добавлять сборку или зависимость только ради трёх форм.

**When:** Во время работы над визуальной системой, адаптивностью, валидацией и локальными пустыми состояниями.

**Example:** У формы есть видимые `label`, `required`, `min`/`max` и submit-кнопка до JavaScript; `app.js` добавляет проверку связки «хотя бы один срок», локальную запись и обновление controlled regions. Это остаётся быстро загружаемым и прозрачно ограниченным локальным прототипом.

## Anti-Patterns to Avoid

### Anti-Pattern 1: Premature backend or third-party data boundary

**What:** Подключить API VIN, заводских регламентов, OCR чеков, рыночных цен, аккаунтов, облачной синхронизации или push в рамках v1.

**Why bad:** Эти источники требуют происхождения/актуальности данных, разрешений, аутентификации, политики приватности, обработки сбоев и нового доверительного UX. Они не нужны, чтобы пользователь вручную зафиксировал автомобиль, срок и расход; ложное обещание автоматического регламента опаснее отсутствия функции.

**Instead:** Явный статичный текст «сверяйте с руководством автомобиля» и «данные на устройстве». Проектировать внешние интеграции как будущие отдельные adapters после утверждения источника и продуктовых условий.

### Anti-Pattern 2: Multiple sources of truth

**What:** Хранить суммы, статусы срочности или HTML карточек отдельно от массива записей; обновлять часть экрана вручную после каждой операции.

**Why bad:** Итог расходов, сортировка и срок быстро расходятся после удаления, перезагрузки или изменения пробега.

**Instead:** Persist only raw entities; re-render all controlled derived regions from selectors after every confirmed command.

### Anti-Pattern 3: `alert()` as the UX state system

**What:** Использовать blocking `alert()` для ошибок, а успех показывать только изменением карточки или цвета.

**Why bad:** Такой поток обрывает работу, не даёт устойчивого контекста и не формирует доступную модель состояний; сообщение о сохранении не связано с фактом успешного write.

**Instead:** Использовать полевые сообщения, `role=status` для подтверждений, `role=alert` для редких критических ошибок и нецветовой текстовый статус срока.

### Anti-Pattern 4: Blind trust in stored JSON

**What:** После `JSON.parse()` считать любое содержимое `autoritm-v1` корректной схемой.

**Why bad:** Старый формат, вручную изменённое значение или частично записанные данные могут вызвать ошибку при рендере и сделать приложение недоступным.

**Instead:** Проверять корневую структуру и записи, отбрасывать/карантинировать невалидные элементы, хранить `schemaVersion` и иметь миграцию на границе persistence.

## Scalability Considerations

| Concern | At 100 users | At 10K users | At 1M users |
|---------|--------------|--------------|-------------|
| User data | Всё остаётся в одном `localStorage` ключе на устройстве; объём v1 мал. | Всё ещё нет общей нагрузки: каждый браузер хранит свой снимок. Нужно измерить размер и предложить экспорт до добавления вложений. | Потребуется отдельная серверная модель, авторизация, sync/conflict resolution и политика retention — это новый продуктовый этап, не масштабирование текущего файла. |
| Rendering | Полный `render()` после команды прост и достаточен для десятков записей. | При сотнях/тысячах записей добавить pagination/filtering и рендер изменённой области, сохранив selectors. | Нужны индексированное локальное хранилище/кэш и серверные запросы; решение зависит от подтверждённой multi-device задачи. |
| Deadlines | Пересчитывать при открытии и после изменения пробега/плана. | То же; вычисления линейны и малы. | Фоновые уведомления требуют явного разрешения, service worker и серверного расписания/или подтверждённой платформенной стратегии. |
| Accessibility | Семантические формы, видимые ошибки, тексты статусов и фокус при удалении. | Добавить ручные keyboard/screen-reader regression checks для вариаций дизайна. | Нужны систематические accessibility tests и дизайн-гайд, но базовая state model остаётся той же. |
| External data | Никаких запросов: честные placeholders для будущих возможностей. | Оценить конкретный источник, лицензию, обновляемость и error states до одного adapter. | Изолировать каждого провайдера за backend/API boundary; не давать браузеру ключи и не смешивать импортированные данные с ручными без provenance. |

## Incremental Extension Path

1. **Stabilize v1 state boundary.** Ввести `schemaVersion`, parser/validator, numeric normalization, один `commit()` и selector-и; сохранить один файл/без зависимостей, если это ускоряет UX-итерации.
2. **Make UX states first-class.** Добавить видимые пустые/ошибочные/сохранённые/срочные состояния, live regions, labels and focus behavior; закрепить дизайн-токены в CSS custom properties, не меняя domain model.
3. **Harden the local experience.** Добавить unit tests для reducer/selectors и ручные mobile/keyboard проверки. Рассмотреть экспорт/импорт только когда потребность в восстановлении подтверждена; не называть это синхронизацией.
4. **Research before each v2 integration.** Для регламентов, OCR, рыночной стоимости, напоминаний или account/sync сначала определить источник, юридическое/приватностное основание, согласие, provenance, ошибки и данные миграции. После этого добавить один adapter за пределами domain state; не менять руками введённые записи автоматически.

## Sources

- [MDN — Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) — MEDIUM confidence (official platform documentation).
- [MDN — Storage quotas and eviction criteria](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria) — MEDIUM confidence (official platform documentation).
- [MDN — Constraint validation](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Constraint_validation) — MEDIUM confidence (official platform documentation).
- [W3C — ARIA19: live regions for errors](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA19) — MEDIUM confidence (official accessibility guidance).
- [WAI-ARIA — `status` and `alert`](https://www.w3.org/TR/wai-aria/states_and_properties) — MEDIUM confidence (W3C specification).
- [Drivvo — maintenance reminders by date or mileage](https://www.drivvo.com/en/vehicle-maintenance/) — MEDIUM confidence (vendor confirmation of category pattern; not an implementation dependency).
