# Technology Stack

**Project:** АвтоРитм  
**Researched:** 2026-11-09  
**Scope:** current local-first, mobile-first MVP and the prerequisites for an honest v2 evolution  
**Overall confidence:** MEDIUM — current-stack facts are verified in the repository; browser/platform and security prerequisites are cross-checked against current MDN and OWASP guidance.

## Decision

Keep the MVP as dependency-free HTML, CSS, and browser JavaScript. This is the smallest stack that fully serves the approved v1: one car, manual maintenance tasks, an expense history, due-status calculation, and device-local data. A framework, bundler, database, authentication provider, OCR SDK, or push service would add integration and operational work without enabling a v1 requirement.

The immediate engineering improvement is **not** a framework migration. It is to make the existing client state durable and evolvable: use a documented JSON schema/version, validate before saving, retain the `try/catch` persistence failure path, and add an explicit JSON export/import before asking users to trust the prototype with more history. Serve the app on a local HTTP server in development and from one HTTPS origin when deployed; opening `index.html` directly is fine for a visual demo, but `file:`-URL storage behavior is intentionally undefined across browsers.

## Verified Current Stack

| Technology | Version | Purpose | Why it is appropriate now |
|---|---:|---|---|
| HTML5 forms and native constraint attributes | Browser platform | Car, plan, and expense input | The implementation already uses semantic `form`, `label`, required fields, numeric bounds, and date controls; this is compact and mobile-friendly. |
| CSS with media queries | Browser platform | Mobile-first visual system | `styles.css` is a single, responsive stylesheet with a one-column layout below 750 px; there is no component or theming complexity that merits a CSS framework. |
| Vanilla JavaScript (one IIFE) | Browser platform | State, rendering, validation, due calculations | `app.js` is small and uses DOM APIs plus `textContent`, so it has no runtime dependency or HTML-injection path from user-entered titles. Keep it while the product remains one screen and one owner. |
| `Intl.NumberFormat('ru-RU')` | Browser platform | Ruble and kilometre formatting | Already correctly localizes visible money and numbers for the Russian target audience. |
| `localStorage` (`autoritm-v1`) | Browser platform | Device-local JSON persistence | Suitable for the present small, text-only data model and the explicit local-only promise. The code already catches corrupt JSON and write failures. |
| Static-file hosting | None | MVP delivery | The three source files require neither a server nor installation. Static hosting is the lowest-risk deployment model until a feature actually needs a trusted backend. |

### Current storage boundary

`localStorage` is synchronous, origin-scoped string storage, not a backup or cross-device database. The current single JSON document is appropriate only while records are few and contain no attached files. Web Storage is limited to roughly 10 MiB total per origin (commonly 5 MiB `localStorage` plus 5 MiB `sessionStorage`), may be unavailable under user/browser policy, and is lost when the user clears site data. Private browsing has additional volatility. The product copy must continue to say this clearly.

The README currently instructs people to open the file directly. That is acceptable for a classroom demonstration, but not a dependable persistence contract: MDN documents that `localStorage` requirements for `file:` URLs are undefined and can vary by browser. Use `http://localhost` for local development and one canonical `https://` origin for any hosted beta. Moving between `http` and `https` also creates different local-storage areas, so do that migration before users accumulate data.

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why |
|---|---:|---|---|
| Vanilla HTML/CSS/JavaScript | Browser platform; no package | v1 user interface and calculations | **Retain for MVP.** The approved scope is a single static screen with three forms; a UI framework would not remove a current constraint. Split `app.js` into small ES modules only when it becomes difficult to test or reason about, without introducing a framework first. |
| JSON state schema, e.g. `{ version, car, tasks, expenses }` | Project-defined | Compatible client persistence | Add a `version` now, plus migration and validation functions. It makes a later IndexedDB/server migration explicit instead of treating arbitrary JSON as a durable contract. |
| Static HTTPS host | Current supported platform | Deployment | Required before production PWA, service worker, notifications, account cookies, or secure external API calls. It preserves the local-first UI while enabling later platform capabilities. |

### Database

| Technology | Version | Purpose | Why |
|---|---:|---|---|
| `localStorage` | Browser platform | v1 text-only local data | Keep for the single-car MVP; its limitations are acceptable only because the project deliberately excludes sync, backups, and uploads. |
| IndexedDB | Browser platform; deferred | Larger local structured history and an offline document queue | Adopt only when v2 adds receipt images or a materially larger journal. It is asynchronous and better suited than `localStorage` to files/large structured data, but it adds migrations and recovery concerns that are needless now. |
| PostgreSQL | Managed, supported release chosen at v2 start | Server source of truth for accounts, cars, tasks, expenses, and sync metadata | Use when `SYNC-01`/`SYNC-02` are approved. Relational ownership and transactional updates fit one user → cars → plans/history; do not introduce it before a server exists. The selected host and data location require a separate privacy/legal review for the Russian market. |
| Private object storage | Managed, S3-compatible API; deferred | Original receipt/order files | Needed for `DOCS-01`, not for text. Keep objects private, address them by server-generated IDs, and store their metadata/ownership in PostgreSQL. |

### Infrastructure

| Technology | Version | Purpose | Why |
|---|---:|---|---|
| Local HTTP server | Any maintained static server | Consistent local development | Use it instead of `file:` loading; `localhost` is a secure context for development and is the correct test surface for future service-worker behavior. |
| Web App Manifest | Web platform; deferred | Optional installable app identity | Add after the hosted UI is stable. A manifest supplies install metadata (name, icons, colors); it does not require a framework or backend. |
| Service Worker + Cache Storage | Web platform; deferred | Versioned offline shell and persistent mobile notifications | Add only with HTTPS, cache-version/update tests, and a recovery path. Service workers have no DOM access and cannot use synchronous `localStorage`, so the UI must remain the source of rendering state. |
| Server API (TypeScript on a maintained LTS runtime) | Deferred decision | Authentication, sync, OCR orchestration, push delivery | Add as a single modular backend—not microservices—when the first server-backed requirement is funded. It protects secrets and centralizes authorization, input validation, audit/retention controls, and provider adapters. Pin exact runtime/framework versions in that phase, not during a static MVP. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---|---:|---|---|
| None | — | v1 runtime | Deliberate choice. No install is required for the current prototype. |
| Small IndexedDB wrapper (evaluate at v2) | Pin at adoption | Typed/migrated client persistence | Only after receipts/offline sync make raw IndexedDB code a demonstrated maintenance burden. Keep all storage calls behind a repository interface so this remains replaceable. |
| PWA build/cache helper (evaluate at v2) | Pin at adoption | Precaching and service-worker update workflow | Only if manual, versioned service-worker code becomes error-prone. Do not add it merely for an app icon. |
| Hosted OpenID Connect provider or established auth service | Pin at selection | Login, account recovery, credential handling | For `SYNC-01`; do not write custom password or session infrastructure. If passwords are ever offered, hash only on the server with a modern password-hashing implementation and use secure cookie sessions. |

## Safe Evolution Path

### 1. Complete and harden the local MVP — now

- Retain the static stack and no dependencies.
- Version the persisted JSON, validate types/ranges at the state boundary, and make a migration failure visible rather than silently discarding data.
- Add export/import of the user-owned JSON before calling the product a reliable service book. Import must validate its schema and cap its size.
- Test from `localhost`, and deploy to a single HTTPS origin before inviting real beta users. Preserve the explicit “data on this device” statement.
- Do not put service rules, VIN data, OCR results, market prices, or AI recommendations into the client as if they were verified data.

### 2. Add PWA shell only when installation/offline is a validated need

Prerequisites: stable HTTPS origin, `manifest.webmanifest`, app icons, service-worker registration, versioned asset cache, offline/error screen, update UX, and test coverage for activation/rollback. A PWA can be installable with a manifest; a service worker is normally added for an offline experience. Do not assume a PWA alone creates scheduled reminders.

### 3. Add notification delivery only after there is a backend

The existing “show a due status on open” behavior is the correct v1 reminder. True background reminders need all of: HTTPS, an active service worker, an explicit user-gesture permission request, a stored push subscription, a server scheduler, a protected sender/VAPID configuration, unsubscribe handling, and a non-notification fallback. Mobile browsers require persistent notifications from the service worker, and notification API support/permission behavior varies, so this must be feature-detected and should never block the core task list.

### 4. Add accounts and synchronization as one vertical slice

Prerequisites: HTTPS API, chosen identity provider, server-side authorization per user and car, PostgreSQL schema/migrations, conflict rules, encrypted backups, deletion/export policy, observability, and migration from anonymous local data. Prefer a backend-for-frontend with `HttpOnly`, `Secure`, `SameSite` cookies; never store session IDs, JWTs, refresh tokens, or API keys in `localStorage`. Start with one-device-to-account import and last-write conflict review rather than pretending automatic merging is solved.

### 5. Add receipt/OCR integration last

Prerequisites: authenticated server endpoint, file type/size allowlist, content/signature validation, malware scanning or sandboxing where available, private object storage outside the web root, rate limits, provider-secret isolation, lifecycle/retention controls, and a review UI. OCR output is a draft: the user must see and confirm the extracted date, work, amount, mileage, and currency before a history record is written. The model/provider is an implementation detail selected after real sample receipts and Russian-language accuracy criteria exist; the app must not expose an OCR API key or make autonomous bookkeeping changes.

## Alternatives Considered

| Category | Recommended | Alternative | Why Not Now |
|---|---|---|---|
| UI architecture | Vanilla HTML/CSS/JS | React/Vue/Svelte + bundler | The current page has no routing, shared interactive component tree, or team-scale complexity. A rewrite would consume the MVP budget without satisfying a missing requirement. |
| Client persistence | `localStorage` plus schema/export | IndexedDB immediately | Text-only state is small and current code already persists it. IndexedDB is warranted by files/offline-sync complexity, not by a speculative future. |
| Deployment | Static HTTPS host | Backend/full-stack host immediately | v1 does not need secrets, identity, shared data, uploads, or scheduled jobs. |
| Reminders | Due status when app opens | Push notification now | Push needs permission, service worker, subscription storage, and a server sender; it cannot be truthfully delivered by the local static prototype. |
| Authentication | Defer | DIY username/password | It introduces credential storage, recovery, abuse prevention, authorization, and session security before the product needs accounts. |
| OCR | Defer with server-side review flow | Client-side direct AI/provider call | It leaks credentials, has no safe upload/retention boundary, and would encourage unconfirmed records. |

## Installation

```bash
# MVP: no npm packages and no build step.
# Serve the directory locally rather than relying on file:// behavior.
python -m http.server 8000

# Then visit http://localhost:8000/
```

No `npm install` command is recommended for the current MVP. Select and pin packages only inside the phase that introduces the capability requiring them, along with tests, migrations, and a security review.

## Sources

- **HIGH (repository evidence):** `README.md`, `index.html`, `app.js`, `styles.css`, `PRD.md`, and `.planning/PROJECT.md` — verified the static dependency-free implementation, the `autoritm-v1` storage key, and the approved v1/v2 boundary.
- **MEDIUM (official platform docs, cross-checked):** [MDN: localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), [MDN: Storage quotas and eviction](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria), and [MDN: Using Web Storage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API) — origin, `file:` behavior, availability, quota, and eviction constraints.
- **MEDIUM (official platform docs, cross-checked):** [MDN: what is a PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/What_is_a_progressive_web_app), [MDN: Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API), [MDN: Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API), and [MDN: Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API) — HTTPS, manifest, service-worker, permission, and push prerequisites.
- **MEDIUM (official security guidance, cross-checked):** [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html), [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html), and [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html) — secure session, credentials, and document-upload controls.

## Confidence Notes and Research Gaps

- **HIGH:** The MVP recommendation, because the repository demonstrably implements every approved v1 functional flow without dependencies.
- **MEDIUM:** Browser/PWA/notification prerequisites, based on current primary documentation; actual behavior still needs mobile-browser testing on the supported audience devices.
- **MEDIUM:** Auth, sync, and OCR guardrails, based on primary OWASP guidance. A later phase must choose vendors, Russian data residency/contract terms, retention periods, costs, and an incident/support model.
- **Not yet researched:** Licensed sources for manufacturer schedules, valuation data, and the representative Russian receipt/document set. These are product/data-procurement decisions, not client-stack choices.
