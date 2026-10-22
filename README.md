# KOMPAZ web frontend

The web client for KOMPAZ.

<details>
<summary>Table of Contents</summary>

- [KOMPAZ web frontend](#kompaz-web-frontend)
  - [🏃‍♂️ Getting started](#️-getting-started)
    - [🔗 Links](#-links)
    - [👤 Test accounts](#-test-accounts)
    - [✉️ Logging in](#️-logging-in)
    - [🟢 OpenAPI](#-openapi)
  - [🚀 Deployments](#-deployments)
    - [🔁 Github Workflows](#-github-workflows)
    - [🛠️ DIY](#️-diy)

</details>

## 🏃‍♂️ Getting started

The local `.env` is in 1Password, in the shared vault under **Kompaz frontend local .env**. [`.env.example`](./.env.example) explains each variable.

To run this project, [use `bun`](https://bun.sh/):

```sh
# Install dependencies
bun install
bun run dev
```



### 🔗 Links

The project's Slack channel has bookmarks to the Figma design, the Jira board, Mailtrap and the project folder on Google Drive.

### 👤 Test accounts

Test accounts are listed in **Test Instructions - Kompaz** in the project folder on Google Drive.

### ✉️ Logging in

There are no passwords: you enter your e-mail address and the backend mails you a login link. Every e-mail the backend sends, login links included, goes to Mailtrap, not to a real inbox.

**On development**, open the link from Mailtrap and confirm.

**On local**, the link in the e-mail doesn't work as is. The backend builds it from its own frontend URL, so it points at the development site, not at your dev server. Opening it would log you in on development, because the session cookie belongs to the site that redeems the token. So:

1. Request a login link on your local login page.
2. Open the e-mail in Mailtrap and copy the `token` value from the link.
3. Open your local login page with it: `https://localhost:5173/inloggen?token=<token>` (or `/login?token=<token>` in English), then confirm.

### 🟢 OpenAPI

Vite generates the api-related files on every dev and build run, from the openapi spec. These files provide typesafe API clients and form validators.

`openapi.json` is vendored from the backend, which owns the contract. Refresh it from `https://backend.kompaz.igne.link/docs/api.json`, so a contract change arrives as a reviewable diff. Never hand-edit it to make the frontend compile.

### 💻 Editor setup

#### Code quality

Most of us [work with VSCode](https://code.visualstudio.com/) or clones thereof. Project settings are applied automatically. Make sure you've installed the [Oxc](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode) editor extension, which covers both linting and formatting.  
You should find it in the "Recommended" section of the extensions tab.

If you use another editor, the same applies: make sure it understands `.oxlintrc.json` and `.oxfmtrc.json`.

#### Claude

The `.claude` folder can be extended per project by specific skills, etc. See Claude docs.  
To overwrite any general settings, create a `settings.local.json` file.

[`.claude/settings.json`](./.claude/settings.json) lists the plugins this project relies on. Check that they're enabled and signed in before starting work here.

## 🚀 Deployments

The app is hosted on **DigitalOcean App Platform**, one app per environment, each
building this repository's [`Dockerfile`](./Dockerfile) itself. The image is a
Bun build of the SPA served by nginx on port 8080. Visitors reach it through
IGNE's shared proxy ([`@igne-agency/proxy`](https://www.npmjs.com/package/@igne-agency/proxy)),
which also sends the backend's paths to the backend.

| Branch        | Hostname                       | App                           | Backend                                    | Repository secret       |
| ------------- | ------------------------------ | ----------------------------- | ------------------------------------------ | ----------------------- |
| `develop`     | `https://kompaz.develop.igne.link` | `kompaz-web-frontend-dev`     | `https://backend.kompaz.igne.link`         | `DO_APP_ID_DEVELOPMENT` |
| `staging`     | `https://kompaz.staging.igne.link` | `kompaz-web-frontend-staging` | `https://backend.kompaz.staging.igne.link` | `DO_APP_ID_STAGING`     |
| `main`        | not decided yet                | `kompaz-web-frontend`         | not deployed yet                           | `DO_APP_ID_PRODUCTION`  |

A release is promoted, never skipped ahead: feature branches merge into
`develop`, a pull request from `develop` into `staging` ships it to staging
(`https://kompaz.staging.igne.link`), and a pull request from `staging` into
`main` ships what staging already ran to production. The backend follows the
same order with its own `development` → `staging` → `main`, so promote both
together when a change spans them.

> The production backend has no code deployed — its fortrabbit app answers every
> path with fortrabbit's own 403 page and has no custom domain — so
> [`.do/app.production.yaml`](./.do/app.production.yaml) still carries
> placeholders and must not be applied yet. Production will run a proxy of its
> own, not the shared one; see that file.
>
> The `api` origin in `proxy/proxy.json` is the backend's real public origin, not
> its `*.frbit.app` default: development's default domain 301-redirects to
> `backend.kompaz.igne.link`, and proxying to a redirect would send the browser
> cross-origin on every call.

### 🔁 The pipeline

[`.github/workflows/ci.yml`](./.github/workflows/ci.yml) runs `bun run build`
followed by `bun run check` on every pull request and on pushes to the three
deploying branches. Only once those pass does it call
`doctl apps create-deployment --wait` for the matching app, so a build or
typecheck failure never reaches DigitalOcean's builder.

`build` has to run before `check`: the API client (`src/lib/heyapi`) and the
paraglide messages (`src/lib/paraglide`) are emitted by Vite plugins during the
build, so on a clean checkout there is nothing for `tsc` to resolve until it has
run.

Because CI owns the trigger, `deploy_on_push` is `false` on every app. Turning it
on would let an unverified commit deploy itself.

### 🌐 How requests reach the backend

The app sends API requests to its **own origin** (`VITE_API_BASEURL=/api`), which
is what keeps them free of CORS and the auth cookie first-party. IGNE's shared
development and staging proxies make that work: they serve
`kompaz.develop.igne.link` and `kompaz.staging.igne.link` and send each path to
the origin [`proxy/proxy.json`](./proxy/proxy.json) names for it.

| Path                                                     | Goes to                                            |
| -------------------------------------------------------- | -------------------------------------------------- |
| `/api`, `/sanctum`                                       | the backend (`api`), `backend.kompaz.*.igne.link`  |
| `/nova`, `/nova-api`, `/nova-vendor`, `/vendor/nova`, `/beheer` | the backend: the admin panel, see below     |
| everything else                                          | this app (`web`), on its own `….ondigitalocean.app` hostname |

The proxy also adds `Strict-Transport-Security` and `X-Content-Type-Options`, and
`X-Robots-Tag: noindex` on development and staging. Everything else this app's
pages send (the Content-Security-Policy, caching) still comes from nginx,
[`default.conf`](./default.conf).

**Changing a path.** A new route prefix on the backend needs a line in
`proxy/proxy.json`, or it gets this app's `index.html` (a POST gets a 405). The
Vite dev server reads the same file, so locally it works as soon as it is there.
On a merge to `develop`, [`proxy-sync.yml`](./.github/workflows/proxy-sync.yml)
checks the file and proposes it to the shared proxies
([`IGNE-Agency/igne-proxy-shared`](https://github.com/IGNE-Agency/igne-proxy-shared)),
where it goes live once that pull request is merged. It needs the repository
secret `PROXY_SHARED_TOKEN`.

| Variable           | Scope      | Example                            |
| ------------------ | ---------- | ---------------------------------- |
| `VITE_API_BASEURL` | build time | `/api`                             |
| `VITE_API_ORIGIN`  | build time | `https://backend.kompaz.igne.link` |

`VITE_API_BASEURL` is inlined into the bundle by Vite and so must be a build-time
variable. `VITE_API_ORIGIN` is build-time too, for another reason: the build
generates the API client from `{VITE_API_ORIGIN}/docs/api.json`, so every app
needs it set to its own backend or its build fails. The bundle never calls it.

### 🛠️ Nova

The admin panel is served on this app's hostname too, so it shares an origin with
the app. The proxy sends Nova's path prefixes to the backend:

| Prefix         | What it serves                                                    |
| -------------- | ----------------------------------------------------------------- |
| `/nova`        | the panel itself (`NOVA_PATH` in the backend's `config/nova.php`) |
| `/nova-api`    | Nova's internal API, and its scripts and styles                   |
| `/nova-vendor` | routes Nova packages register (the drag-and-drop reordering)      |
| `/vendor/nova` | Nova's published assets (`app.js`, `app.css`, fonts)              |
| `/beheer`      | the emailed-link sign-in that replaces Nova's password form       |

Three things this depends on:

- **`TRUSTED_PROXIES=*` on the backend.** The proxy sends the backend's own
  hostname in `Host`, so the browser's hostname travels in `X-Forwarded-Host`.
  Laravel only believes that header from a trusted proxy, and until it does,
  every Nova redirect and generated link sends the user to the backend's domain.
- **Nova's license is validated against the domain it is served from**, so this
  app's hostname has to be registered as a site on the license.
- **Nova's magic links are built from `APP_URL`, not `FRONTEND_URL`.** They keep
  pointing at the backend's domain until `APP_URL` is changed to this one.

Nova never gets this app's Content-Security-Policy: its layout carries inline
`<script>` blocks and no CSP nonce, so the app's `script-src 'self'` would stop
the panel from booting. The backend sets the panel's own headers.

Changing `NOVA_PATH` on the backend means changing `proxy/proxy.json` to match.

### 🛠️ Running the production image locally

```sh
docker build -t kompaz-fe .
docker run --rm -p 8080:8080 kompaz-fe
```

The image serves only the SPA. To try it with the backend behind it, run the
proxy in front of it as `@igne-agency/proxy`'s `docs/local-development.md`
describes.
