# CLAUDE.md

You are working in a production TypeScript + React repository. Make safe, minimal, maintainable changes that fit the existing architecture.

**Primary rule**: before changing code, read the surrounding files and follow the patterns already present. Prefer the pattern used closest to the code you are editing.

---

## Stack

| Concern         | Tool                                                              |
| --------------- | ----------------------------------------------------------------- |
| Package manager | `bun`                                                             |
| Build           | Vite                                                              |
| Framework       | React 19 + TypeScript 5.9                                         |
| Routing         | `@tanstack/react-router`                                          |
| Data fetching   | `@hey-api/openapi-ts` SDK + `@tanstack/react-query`               |
| API types       | Generated into `src/lib/heyapi/` from `openapi.json`              |
| Auth            | Magic link, bearer token — `src/lib/auth.ts`                      |
| Forms           | `@tanstack/react-form` via `src/lib/forms/index.tsx`              |
| UI primitives   | `@base-ui/react`                                                  |
| Styling         | CSS Modules + SCSS (`sass`)                                       |
| i18n            | `@inlang/paraglide-js`                                            |
| Unit testing    | **Not installed**                                                 |
| E2e Testing     | **Not installed**                                                 |

---

## Verification

Before finishing any task, run in order:

```
bun fix   # Auto-fix formatting, then type-check
```

On a fresh clone this fails until `bun run gen` has run: `router-i18n.ts`
imports a type from the generated, gitignored `src/routeTree.gen.ts`.

Never bypass hooks or suggest `--no-verify`.

---

## UI primitives — base-ui

Before implementing any interactive widget (dialog, popover, menu, select, checkbox, slider, tooltip, etc.), fetch `https://base-ui.com/llms.txt` and use the relevant `@base-ui/react` primitive. Do not hand-roll accessible widgets.

---

## Generated files

- Generated files should be gitignored.
- Do not edit generated files.
- Include new generated files/folders in the gitignore, under the right comment heading.
- Gitignored files not under the specific generated files heading are not necessarily generated, and thus are exempt from this rule.

`bun run gen` regenerates the route tree and the API client. Paraglide output
(`src/lib/paraglide`) is **not** covered by it — that still needs `bun run dev`
or `bun run build` once, because the Paraglide CLI cannot take the
`urlPatterns` and `localStorageKey` that `vite.config.ts` passes.

`openapi.json` is vendored from the backend, not written here. Refresh it from
`https://develop.kompaz.igne.link/swagger/v1/swagger.json` and regenerate;
never hand-edit it to make the frontend compile.

---

## TypeScript

- No `any`
- No casts — help the compiler infer correctness through runtime logic. If a third-party type makes this impossible, cast with a comment explaining why. Last resort only.
- No non-null assertions — prefer type guards and narrowing
- No duplicate type definitions — reuse exported types from API, hooks, or shared modules
- Add JSDoc to util functions you create, including at least one example. Add docs to existing util functions you edit that are missing them. Keep types in typescript.

---

## React

- Extract into subcomponents or hooks when a component exceeds ~150–200 LOC
- No global state for local UI concerns
- No `useEffect` for logic that can run during render, in event handlers, or as derived/memoized values
- No `useMemo` / `useCallback` unless solving a real referential stability or performance problem
- No hardcoded user-facing copy — use i18n keys

---

## CSS

- Use the sass features `@extend` or `@include` (mixins) instead of css modules' `composes` feature

---

## Data fetching

- Use the existing HeyApi sdk / TanStack Query patterns
- Always handle loading, empty, and error states
- Never hardcode URLs, tokens, or environment-specific values

---

## Routing

- Any new route must declare its URL translations in `router-i18n.ts` (`translatedPathnames`), keyed by its router path with a localized path per locale. Non-index routes are required to have translations.

---

## i18n

- This project uses Paraglide JS. When in doubt about message format, arrays, pluralization, or other Paraglide-specific behavior, consult the docs at https://inlang.com/m/gerre34r/library-inlang-paraglideJs before making assumptions.
- Messages are in `/messages/{locale}.json`, per `project.inlang/settings.json`
- Scope keys to their feature, not a generic layer — `login_email` not `field_email`. Identical strings across features should still have separate keys so they can evolve independently.
- Reserve `common_` only for structural UI strings unlikely to ever diverge, like `common_save` or `common_cancel`. Field labels don't qualify.
- Use `{feature}_{concept}` as the default pattern: `login_submit`, `nav_logout`, `error_page_title`.
- Separate logical groups of keys with a blank line (roles, loading messages, nav, pages, etc.).

---

## Scope

- Change only what is necessary for the requested outcome
- Do not refactor files you are not already modifying
- Do not add dependencies unless clearly necessary — prefer what is already in `package.json`
- Do not add comments unless the _why_ is non-obvious to a future reader

---

## Tests

- Only write tests if similar tests already exist, or explicitly asked to
- Never use snapshots
- Never write unit tests for components
