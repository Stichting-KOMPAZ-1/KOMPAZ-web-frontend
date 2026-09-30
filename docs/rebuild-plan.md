# KOMPAZ — staged rebuild

## Context

The template strip (`vite-react-template` IGNE v3.0.0 → clean product repo) is
**complete**; this document no longer records it. What remains is one job:
**bring `zelfzorg-academie` (Lovable) onto this repo, core-first.**

**The most important framing decision: this is not a migration, it's a rebuild with the old app as the specification.** Nothing is live, the backend starts green, and no data is migrated. That means we are not obliged to preserve anything — we *choose* what to carry forward. The consequences are large and good:

- The 155 SQL migrations and 268 RLS policies are **domain-model reference material**, not something to port.
- The 629-line technical audit stops being a bug list and becomes a **design brief**. Its blockers (no captions, `lang="en"`, no document structure, six failing contrast tokens) are nearly free to get right in a rebuild and expensive to retrofit.
- The only assets that genuinely *must* survive are **the course content** (6,809 LOC of TypeScript + 23 MB images + 22 MB Dutch audio) and the domain knowledge encoded in the old repo's `docs/user-stories.md`.

> **Note on referenced documents.** This plan cites `docs/technical-audit-2026-09.md` and `docs/user-stories.md`. Neither is in this repo — both live in the old Lovable repo. Any phase that depends on them (notably Phase 5's content work) needs those files brought across first.

### Decisions taken

| Question | Answer |
| --- | --- |
| Backend | **In active development, and changing.** It publishes an OpenAPI document, which is the only property this plan depends on. Implementation details are deliberately not recorded here; they would go stale faster than this document is revised |
| Auth | **None.** This frontend does not authenticate, and the e-learning editor is being built in the admin panel |
| Rendering | **SPA, permanently.** SSR will not be implemented — see Part A |
| Rollout | Nothing live; staged MVP releases |
| Data | **Greenfield, no data migration** |
| First slice | **The first public route** (Phase 3) — the admin screens are supplied by the backend's own panel |
| Analytics | **Redesign during the rebuild** |
| Mocking | **No MSW for now** — develop backend is live; revisit if an e2e runner ever needs deterministic fixtures |

---

## Part A — Rendering strategy

### Decision: **SPA. SSR is not being implemented.**

The template is a SPA and stays one. No TanStack Start, no server rendering, at
any phase. This is a rejection, not a deferral — earlier revisions scheduled an
SSR re-decision at Phase 3; that re-decision has been taken, and the answer is
no.

**What that costs, and how each cost is paid instead.** The arguments for SSR
were real and they all landed on the public, patient-facing surface. Accepting
the SPA means accepting these, so they are recorded as *consequences* rather than
as open questions:

| Cost | What we do instead |
| --- | --- |
| **Link previews.** `/info/:orgSlug` and share/QR URLs get pasted into email and messaging, and OG/Twitter crawlers **do not execute JavaScript** — client-side meta injection can never fix this | The only remaining option is **prerendering or static OG meta** for the public routes at build time, or a small edge function that serves crawlers real HTML. Neither is SSR and neither is free — decide at Phase 3 which, or accept that shared links render bare |
| **First paint on the patient path** — a QR scanned at a hospital bedside, on the patient's phone and hospital wifi. The audit measured 282.9 kB gzipped | Becomes a **bundle-budget problem instead of a rendering one**, which raises the stakes on D2's decision to move course content out of the bundle and on the `size-limit` gate in the Phase 3 checks |
| **Per-org branding flash.** The correct palette cannot ship in the first byte | Every patient sees KOMPAZ bordeaux flash to their hospital's brand. Mitigate in D1 by writing the Layer 1 properties from a blocking inline script in `index.html` before first paint, rather than from React |

Two things sometimes mistaken for bugs are not bugs in a SPA, permanently and not
pending a revisit: `__root.tsx` reading `window.location.href` in `beforeLoad`,
and paraglide's `localStorage` strategy. Leave both alone.

---

## Part B — Carried over from the template strip

Everything else in the strip is done and has been removed from this document.
These three items are open.

### B1. Visual identity — its own branch, next

All of these need design input rather than a find-and-replace, and they are the
only work available in this repo while the backend catches up:

- `src/assets/icons/logo.svg` — still the IGNE mark, visible in the app header.
- `public/favicon.svg` — still IGNE.
- The three `TODO: Match this with your project's design` headers in
  `src/style/variables/{color,fonts,unit}.scss`. **`color.scss` is also where
  D1's Layer 2 change lands**, so the palette work and this cleanup are the same
  job — do them together rather than twice.
- `LICENSE` still reads `Copyright (c) 2025 Igne`. An ownership question, not a
  design one, but it travels with the rebrand.

### B2. The forms pass — its own branch, after the visual identity

`ErrorText` accepts the full `HTMLAttributes` set in its type but never spreads
it — only `el`, `className`, `children` and `htmlFor` are destructured, and there
is no `...rest` on the rendered element. This is not cosmetic: `field.tsx`
renders `<ErrorText el="span" {...props}>` with the props base-ui's `Field.Error`
render prop supplies, which carry the `id` that the input's `aria-describedby`
points at. Dropping them breaks the association between a field and its error
message, so it is an accessibility defect.

### B3. Constraints the finished work leaves behind

Not status — traps that cost time to find once and should not cost it twice.

- **A fresh clone must run Vite once** (`bun run dev` or `build`) before
  `bun run check` passes, because `router-i18n.ts` imports from generated files.
  This is accepted, not a defect: the Vite plugins watch their own sources, so
  nothing needs regenerating by hand afterwards. Tooling it was tried and
  reverted in `152f4f6`.
- **Codegen has exactly one path: Vite.** `openapi.json` is vendored and the
  backend owns it; refreshing is `curl` plus the next `bun run dev`. Do not add a
  second entry point — it can only drift.
- **`package.json` `name` feeds the Paraglide localStorage key**
  (`` `${name}-lang` ``), so renaming the package silently resets every stored
  locale.
- **Oxlint suppressions take `--`, not `:`.**
  `// oxlint-disable-next-line rule -- why` works;
  `rule: why` silently suppresses nothing.
- **Oxfmt is pre-1.0 and pinned exactly.** A version bump can reformat the whole
  repository in one commit; treat upgrades as their own change. It also has no
  plugin system, so CSS property order is no longer enforced by tooling — keep it
  by review.
- **No test runner is installed, deliberately.** Install one with the first thing
  that actually needs it: the contrast fitness test in D1, or the Phase 3
  public-route checks. The **fitness tests to port live in the old repo**.

---

## Part B-open — contract gaps to raise with the backend team

**These are the critical path.** Phase 0 is finished and every phase below is
blocked on this list. Re-ask whenever the backend changes shape — several may
resolve for free while a schema is still being designed.

| Gap | Blocks | Note |
| --- | --- | --- |
| **No public endpoints yet** | Phase 3 | **The blocker.** Nothing this frontend can consume exists — no course, module or org-info endpoints. Phase 3 cannot start against a contract that isn't there |
| **No org `slug`** | Phase 3 | `/info/:orgSlug` and localized public URLs have no key. Orgs are UUID-only today. Same conversation as the row above |
| **No brand colour fields** | D1 | Only logo upload exists. D1's palette feature has no backend at all. Cheapest to settle while the schema is still being designed |
| **Role vocabulary** | Whichever phase first renders per-role UI | The old app had `admin \| instructor \| user \| elearning_editor \| org_admin`; the backend has its own, shorter set. Needs an explicit alignment conversation, not a frontend mapping |
| **No analytics endpoint** | Phase 7 | D3's `POST /events` does not exist yet |
| **CORS** | Phase 3 / hosting | Currently permissive, so a cross-origin deployment works. This is a backend setting that can change without notice, so confirm it when hosting is chosen rather than assuming it |

#### Defects in the published spec

Re-verified 2026-09-17.

| Defect | Effect |
| --- | --- |
| **Pagination envelope typed wrong** | `items`, `pageNumber`, `pageSize` and `totalCount` are all declared `type: "string"`, so codegen emits `items: string`. **Blocks every list screen** — the worst of these |
| **No security schemes** | `components.securitySchemes` is `{}` and no operation declares `security`. Now low priority — this frontend does not authenticate |
| **`allOf` carrying only `required`** | `/auth/me` and `AuthenticationResource.user` generate `zUserResource.and(z.record(z.string(), z.unknown()))`; the extra fields stay untyped |
| **Untranslated validation keys** | The `errors` map returns raw keys like `validation.required`, though the spec's own description promises Dutch messages. The `title` *is* translated |
| **`info.title` is "Laravel"** | Cosmetic, but it is what the generated client is named after |

**A pattern to expect:** validation failures were documented as Laravel's
`{message, errors}` under 422 while the API actually answered RFC 9457 problem
details under 400 — fixed 2026-09-17. One consequence survives: the problem shape
is declared under `components.responses`, and the generator only names things
under `components.schemas`, so it is inlined per operation with no importable
type. That is why `src/lib/forms/validation-helpers.ts` still hand-writes
`zValidationProblemDetails`.

---

## Part C — Staged rebuild

Phases 0 (foundation), 1 (auth) and 2 (admin core) are closed — done, dropped and
superseded respectively. **Phase 3 is the first slice.**

Two things Phase 2 owned are not admin features and move forward with it:

- **`effectiveOrgId` and org-scoped query keys** — needed by any screen that
  renders org-specific content, and cheaper to build in than to retrofit because
  it keys every query. `src/lib/query-keys.ts` and `QueryCacheOrgGuard` are the
  parts to port from the old repo.
- **Per-org branding** — D1's Layer 3 semantic tokens, a frontend concern
  regardless of which admin tool edits the values.

### Phase 3 — First public route + theming proof ← *the first slice*

`/info/:orgSlug` and one e-learning course end to end. **Decide hosting here.**
SSR is not a question (Part A), but two of the three things it would have solved
still need an answer at this phase: whether to prerender OG meta for shared
links, and the bundle budget on the patient path.

**Blocked on the backend, not on us** — endpoints and an org slug, per B-open.

Build **D1 Layer 3** here. It is the layer components depend on, and retrofitting
a semantic layer across a grown component set is the expensive version of this
work.

### Phase 4 — Bibliotheek + QR/share links

Module overview per org, QR codes, share links. Preserve the `qr_codes.short_id` + `/q/:shortId` indirection — it's what makes user story 1.6 (central content update without changing the printed QR) work.

### Phase 5 — Remaining courses + captions

The content pipeline at scale (D2), all 12 courses, and the captions/transcript work.

### Phase 6 — Public signup + impact measurement

`/inschrijven/:orgSlug/:moduleSlug` → staff inbox. Keep the honeypot + strict validation from the old `submit-signup` edge function. Then the impact-measurement follow-up questionnaire (`/meting/:token`), including the 90-day email wipe that the old cron already implements.

### Phase 7 — Dashboards

Usage, savings/ROI, benchmark. Reads the redesigned analytics from D3.

### Deferred — and say so out loud

Bundles (four types, four tables, four builders, ~2,500 LOC), KOMPAZ consultancy panels (quickscan, cockpit, advice reports — service tooling, not product), onboarding tours (1,576 LOC), regiocluster routing (user story 2B, explicitly "the biggest budget dial"), the in-app WYSIWYG content editor (~9 components, tightly coupled to the content model).

**Dropped, not deferred:** the 9-language Google Translate widget (replaced by Paraglide — see D2), PostHog (and **rotate the project key that is currently sitting in plain text in `index.html`**), the mock-only Community and Overzichtskaart features (`mockCommunity.ts` / `mockPatients.ts`; the old `docs/user-stories.md` marks both as validation-stage), and every Lovable-specific file (`lovable-tagger`, `previewAuthStorage.ts`, both Playwright configs — which reference a package that isn't even installed — `tailwind.config.lov.json` at 187 kB, the 225 `.asset.json` sidecars, and the `preview-transactional-email` function).

---

## Part D — The three cross-cutting features

### D1. Per-organisation colour palettes

**Status: designed, not buildable.** The backend has no brand colour fields — only logo upload. Keep this design as the target anyway, because token structure is the part that's expensive to change later.

**What exists in the old app** is more than colour: `brand_primary`, `brand_accent`, `brand_background`, `brand_foreground`, `brand_palette_preset` as HSL triples; **8 named presets** (`bordeaux` default, `oceaan`, `bos`, `zonsopgang`, `paars`, `neutraal`, `smaragd`, `koraal`); **palette extraction from an uploaded logo**; a **per-org favicon**; and a **per-org academy label**. `BrandProvider.tsx` writes seven CSS custom properties to `document.documentElement` at runtime.

**What this repo has** is a genuinely good ramp generator in `src/style/variables/color.scss`: a SCSS `$colors` map expanded by `@each` into 19 steps (`--color-{name}-050…950`) via `color-mix(in oklch shorter hue, …)`. Two things block per-org use:

1. The mix reads a **compile-time** SCSS variable (`#{$color}`), so ramps are frozen at build time.
2. **There is no semantic layer.** `src/style/main.scss` hardcodes `white`/`black` on `body`, and components reach directly for ramp steps like `--color-error-500`. Even with runtime-swappable ramps, a component asking for `white` stays white.

**Three-layer structure:**

```
Layer 1   --brand-primary, --brand-accent, --brand-background, --brand-foreground
          └─ the only org-overridable values
Layer 2   --color-primary-050 … -950, --color-accent-050 … -950
          └─ generated ramps
Layer 3   --surface-default, --surface-raised, --text-default, --text-muted,
          --text-on-primary, --border-default, --action-primary-bg, --focus-ring
          └─ the ONLY layer components may reference
```

The key move is Layer 2: **change the `@each` to mix from `var(--brand-#{$name})` instead of `#{$color}`.** `color-mix()` is a runtime CSS function that accepts `var()`, so overwriting one custom property recomputes all 19 steps — no JavaScript colour math, no rebuild. Setting four properties re-themes the entire app. Store hex rather than HSL triples; `color-mix` takes any CSS colour, and the pickers already convert.

**Layer 3 is worth building early even without backend colour fields** — it's the part components depend on, and retrofitting a semantic layer across a grown component set is the expensive version of this work. That means Phase 3.

**Delivery:** written to `document.documentElement.style` on org change, driven by `effectiveOrgId`. **There is no SSR to remove the first-paint brand flash** (Part A), so the mitigation belongs here: set the four Layer 1 properties from a blocking inline script in `index.html`, keyed off the org slug in the URL, before React mounts. That is the whole reason Layer 1 is only four values.

**Contrast safety.** Arbitrary customer brand colours will eventually produce unreadable text — the old app's own tokens already fail, with six measured violations (`muted-foreground` at 4.33:1, `border` at 1.21:1, dark-mode `primary` and `ring` at 2.62:1). CSS `color-contrast()` is not reliably supported, so **decide contrast at authoring time, not render time**: the branding UI validates the chosen palette against WCAG AA and stores an explicit `on-primary` value. Back it with a **contrast fitness test** that parses the token file and asserts 4.5:1 / 3:1 — this is the sort of guarantee you cannot get from review.

This matters commercially, not just legally: the white-label public surface renders under the *customer's* brand, so **the customer's own accessibility obligation flows into this code**, and an EN 301 549 conformance report is a sales asset. Dark mode can be dropped — `next-themes` is installed in the old app but only `sonner.tsx` imports it, and there is no toggle anywhere.

### D2. Localization

**This repo's setup is good and stays as-is:** `baseLocale: nl-NL`, URL-based locale, **type-required** translated pathnames in `router-i18n.ts`, and `deLocalizeUrl`/`localizeUrl` router rewrites so application code only ever sees canonical paths.

**What it replaces is a liability.** The old app has no i18n library at all — all copy is hardcoded Dutch, `index.html` declares `<html lang="en">` over Dutch clinical content, and translation is the **deprecated Google Translate widget** driven by scraping a hidden `<select>` positioned off-screen, with a `window.location.reload()` fallback. It machine-translates clinical Dutch ("spoel de canule door met steriel water") into 9 languages with no review step and no MT notice, renders **Arabic left-to-right** (`dir="rtl"` exists only in the print route), and ships user IP and page content to Google with no consent gate. Paraglide deletes `google-translate.ts` (176 LOC) plus its CSS hacks and fixes `lang` and `dir` for free.

**Two decisions:**

- **Scope the locales.** Ship `nl-NL` (source) + `en-US` reviewed, rather than reproducing 9 machine-quality locales. For clinical instruction, a reviewed translation is a safety requirement, not a nicety — unreviewed MT of dosage and sterility instructions is the kind of defect that ends a healthcare contract. Add locales when someone is funded to review them.
- **UI strings and course content are different things.** Roughly 1,700–2,000 UI message keys belong in Paraglide catalogues; the ~6,800 LOC of clinical course prose does **not** — it's content, and it belongs in the DB. Conflating them puts medical copy behind a developer deploy.

Because `nl-NL` is already the base locale, **extraction happens per-screen as each screen is built** — no big-bang pass, and no translation work blocks any phase. Follow `CLAUDE.md`'s convention (`{feature}_{concept}`, feature-scoped, `common_` reserved for structural UI only).

One thing to settle with the backend: the old schema used **Dutch status enums** (`gepland`, `verstuurd`, `ingevuld`, `vervallen`, `geen`, `trial`, `actief`, `verlopen`). The new backend already uses English (`Invited`/`Active`, `Member`/`Administrator`/`PlatformAdministrator`) — this one resolved itself correctly.

**Content sourcing (the biggest strategic call in the rebuild).** Course content currently exists **twice** — as TypeScript in `src/data/*.ts` *and* as jsonb in `interactive_elearning_content` — merged at runtime by a hand-rolled cache in `elearning-courses.ts` (657 LOC, its own subscriber/notify system), with a live WYSIWYG editor writing to the DB half. The audit suspects this dual-source arrangement is the origin of the **7 byte-identical audio pairs whose filenames are not synonyms** (`blauwe-plek.mp3 == aandachtspunten-prikken.mp3`) — i.e. a possible content-safety defect where a step plays narration describing a different step.

**Recommendation: the database is the single source of truth; the TypeScript files become a one-time seed script.** Three reasons: the editor already writes to the DB, greenfield means the schema can be designed properly now, and 6,809 LOC of content in the frontend bundle is the direct cause of the measured 59 kB regression (`AuthContext.tsx` imports `setCurrentOverrideOrg` from `elearning-courses`, which statically imports every course, on every first load *including QR links*). With SSR rejected, this is also the main lever on the patient-path bundle budget.

Two things to fix in the content model while it's being designed, both nearly free now and expensive later:

- **Add `captions` / `transcript` fields.** There are currently **zero** `<track>` elements across 14 videos, 12 embeds and 4 audio players, over 22 MB of spoken Dutch instruction, and no field in the model to put them in. The audit calls this its most serious finding, and it's right that this is a content project rather than a code one — but the schema change belongs in this rebuild.
- **Audit the 7 duplicate audio pairs before deduplicating them.** If a step is playing the wrong narration, that's a patient-safety bug, not a housekeeping item.

### D3. Analytics — redesign

Redesign is the right call: the event schema changes, so doing it now costs a design conversation and later costs a data migration plus a disclosure. **No endpoint exists yet** — this is a Phase 7 build and a backend request.

**What exists.** `anon-tracking.ts` (266 LOC) writes directly to `anon_activity_logs` from the browser, on an allowlist of public paths. 15 event types, 32 explicit call sites, plus two automatic collectors: a global capture-phase click listener and monkey-patched `history.pushState`/`replaceState`.

**Four problems, and the first is the serious one:**

1. **The path is the diagnosis.** A `device_id` in localStorage that the code comments confirm is *never refreshed*, joined to paths like `/leeromgeving/darmstoma-verzorgen/...` and `/info/<hospital>/tracheostoma-verzorgen`, is pseudonymous **special-category health data** under AVG art. 9 — written with no consent banner anywhere. PostHog compounds it by autocapturing pageviews on those URLs from `index.html` before React even mounts.
2. **Anyone can write the numbers.** The `anon_activity_logs` INSERT policy is `TO anon, authenticated WITH CHECK (true)`. The usage and ROI figures shown to customers and discussed with insurers are unauthenticated public input.
3. **Full visible click text is logged** (`tag:visibleText`, truncated at 200 chars). In a clinical UI, button labels are diagnostically revealing.
4. **No retention and no scale.** `/bewaartermijnen` publicly claims *"Anonieme gebruiksstatistieken — Onbeperkt"*; nothing deletes. And `fetchAnonLogs()` pulls the entire unfiltered table to the client 1,000 rows at a time.

**Redesign, preserving the product requirement.** The requirement (user story 3.1) is *unique users per module per period* plus channel attribution via `?via=` — and all of it survives without a permanent identifier or a diagnosis in the payload:

| Change | How |
| --- | --- |
| **Rotate the identifier** | Client id regenerated on a fixed period (e.g. 30 days); backend stores only a salted hash with the salt rotated per period. Uniqueness holds *within* a reporting window, which is all the dashboards need, and cross-period tracking becomes impossible by construction |
| **Never send the diagnosis** | Send opaque `module_id` / `step_id` resolved from typed route params, never the human-readable slug or raw URL. This single change decouples every event from the condition |
| **Explicit events only** | Drop the catch-all click listener; require `data-track` attributes. A compliance fix *and* a data-quality fix — the current dashboard is measuring incidental clicks |
| **Server-authenticated writes** | `POST /events` on the new backend, rate-limited, with `organization_id`, `user_agent` and `referrer` derived server-side rather than trusted from the client |
| **Consent gate** | No analytics before consent, including whatever replaces PostHog. One category (analytics on/off), so a small `@base-ui/react` Dialog is enough — no new dependency unless categories multiply |
| **Retention from day one** | TTL in the schema, and correct the published retention register |

Two patterns from the old app are worth keeping: `src/data/anon-activity.ts` (114 LOC) is the only real repository in the codebase, and the `org-isolation` fitness test enforces that boundary with a deliberately *shrinking* allowlist. Port both.

**One thing to be explicit about with the backend team.** In the old system, multi-tenant isolation was enforced by **268 RLS policies in Postgres**, using `SECURITY DEFINER` predicates (`current_user_org_id()`, `is_org_admin_of()`, `is_kompaz_member()`, `org_has_feature()`). A greenfield non-Supabase backend means that control is **reimplemented from scratch in the service layer** — the platform's primary security guarantee, rebuilt. Two consequences for this repo: every endpoint must be org-scoped server-side, and the frontend's `effectiveOrgId` is a **view selector, never an authorization input**. Worth writing into the API contract explicitly, because frontend tests cannot catch a regression on the server side.

---

## Verification

**Every task:** `bun fix` (Oxlint + Oxfmt + `tsc --noEmit`) per `CLAUDE.md`.

**Phase 3 (the architecture gate)**

- Hosting decided and recorded. (SSR is *not* on the table — Part A.)
- Shared-link previews: either OG meta is prerendered for `/info/:orgSlug`, or this plan records out loud that bare previews are accepted.
- Switching `effectiveOrgId` re-themes without reload and fires `queryClient.clear()` (fitness test).
- **Contrast fitness test** passes for all 8 ported presets — and fails deliberately when fed a known-bad palette. Verify the test actually catches something before trusting it.
- `@axe-core/playwright` on the public route with zero critical violations, plus a manual screen-reader pass — the audit found **two live regions in 55,000 LOC**, so automated checks alone will not surface this class of problem.
- Bundle budget on the public entry: the number to beat is the audit's measured **282.9 kB gzipped**. Add `size-limit` to CI so it can't regress silently.
- Analytics: no event fires before consent; after consent, the payload contains an opaque `module_id` and **no diagnosis slug and no raw path**. Assert this in a test, not by inspection.
