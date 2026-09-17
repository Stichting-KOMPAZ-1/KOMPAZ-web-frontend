# KOMPAZ web frontend

The web client for KOMPAZ.

<details>
<summary>Table of Contents</summary>

- [KOMPAZ web frontend](#kompaz-web-frontend)
  - [🏃‍♂️ Getting started](#️-getting-started)
    - [🟢 OpenAPI](#-openapi)
  - [🚀 Deployments](#-deployments)
    - [🔁 Github Workflows](#-github-workflows)
    - [🛠️ DIY](#️-diy)

</details>

## 🏃‍♂️ Getting started

To run this project, [use `bun`](https://bun.sh/):

```sh
# Install dependencies
bun install
bun run dev
```

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

## 🚀 Deployments

The app is hosted on **DigitalOcean App Platform**, one app per environment, each
building this repository's [`Dockerfile`](./Dockerfile) itself. The image is a
Bun build of the SPA served by nginx on port 8080.

| Branch        | App                       | Backend                            | Repository secret       |
| ------------- | ------------------------- | ---------------------------------- | ----------------------- |
| `development` | `kompaz-web-frontend-dev` | `https://backend.kompaz.igne.link` | `DO_APP_ID_DEVELOPMENT` |
| `main`        | `kompaz-web-frontend`     | not deployed yet                   | `DO_APP_ID_PRODUCTION`  |

> The production backend has no code deployed — its fortrabbit app answers every
> path with fortrabbit's own 403 page and has no custom domain — so
> [`.do/app.production.yaml`](./.do/app.production.yaml) still carries
> placeholders and must not be applied yet.
>
> Point `BACKEND_ORIGIN` at the backend's real public origin, not its
> `*.frbit.app` default: development's default domain 301-redirects to
> `backend.kompaz.igne.link`, and proxying to a redirect would send the browser
> cross-origin on every call.

### 🔁 The pipeline

[`.github/workflows/ci.yml`](./.github/workflows/ci.yml) runs `bun run build`
followed by `bun run check` on every pull request and on pushes to the two
deploying branches. Only once those pass does it call
`doctl apps create-deployment --wait` for the matching app, so a build or
typecheck failure never reaches DigitalOcean's builder.

`build` has to run before `check`: the API client (`src/lib/heyapi`) and the
paraglide messages (`src/lib/paraglide`) are emitted by Vite plugins during the
build, so on a clean checkout there is nothing for `tsc` to resolve until it has
run.

Because CI owns the trigger, `deploy_on_push` is `false` on both apps. Turning it
on would let an unverified commit deploy itself.

### 🔧 First-time setup

1. Create each app from its spec and note the id it prints:

   ```sh
   doctl apps create --spec .do/app.development.yaml
   doctl apps create --spec .do/app.production.yaml
   ```

2. Set the repository secrets: `DIGITALOCEAN_ACCESS_TOKEN` (a write-scoped API
   token) plus the two app ids above.

3. Replace the `CHANGE_ME` backend values in the specs, or set them in the
   DigitalOcean dashboard. DigitalOcean owns the live spec once an app exists, so
   the files under [`.do/`](./.do) are the bootstrap and a record of which
   variables an environment needs — they are not synced automatically.

### 🌐 How requests reach the backend

The app sends API requests to its **own origin** (`VITE_API_BASEURL=/api`), which
is what keeps them free of CORS and the auth cookie first-party.
[`default.conf.template`](./default.conf.template) is what makes that work: nginx
reverse-proxies `/api` to the backend, using two runtime variables.

| Variable           | Scope      | Example                 |
| ------------------ | ---------- | ----------------------- |
| `VITE_API_BASEURL` | build time | `/api`                  |
| `BACKEND_ORIGIN`   | runtime    | `https://kompaz.frb.io` |
| `BACKEND_HOST`     | runtime    | `kompaz.frb.io`         |

`VITE_API_BASEURL` is inlined into the bundle by Vite and so must be a build-time
variable. The other two are read by nginx when the container starts, which is why
one image can serve either environment. Both are required — the container refuses
to start without them rather than failing later on an nginx syntax error.

`BACKEND_HOST` is separate from `BACKEND_ORIGIN` because the backend is routed by
`Host` and terminates its own TLS, so the header and the SNI name both have to be
the backend's hostname rather than ours.

### 🛠️ Nova

The admin panel is proxied onto this domain too, so it shares an origin with the
app. nginx forwards Nova's four path prefixes to the backend:

| Prefix         | What it serves                                                    |
| -------------- | ----------------------------------------------------------------- |
| `/nova`        | the panel itself (`NOVA_PATH` in the backend's `config/nova.php`) |
| `/nova-api`    | Nova's internal API, and its scripts and styles                   |
| `/vendor/nova` | Nova's published assets (`app.js`, `app.css`, fonts)              |
| `/beheer`      | the emailed-link sign-in that replaces Nova's password form       |

Three things this depends on:

- **`TRUSTED_PROXIES` must be set on the backend.** nginx has to send the
  backend's own hostname in `Host`, because that is what routes the request and
  what the TLS handshake needs, so the browser's hostname travels in
  `X-Forwarded-Host` instead. Laravel only believes that header from a trusted
  proxy, and until it does, every Nova redirect and generated link sends the user
  to the backend's domain instead of this one.
- **Nova's license is validated against the domain it is served from**, so this
  app's domain has to be registered as a site on the license.
- **Nova's magic links are built from `APP_URL`, not `FRONTEND_URL`.** They will
  keep pointing at the backend's domain until `APP_URL` is changed to this one.

Nova is deliberately exempt from the app's Content-Security-Policy. Its layout
carries inline `<script>` blocks and has no CSP nonce configured, so the app's
`script-src 'self'` would stop the panel from booting at all. It keeps the
transport and sniffing headers and decides its own caching.

Because the panel's location is a regex over those prefixes, changing `NOVA_PATH`
on the backend means changing [`default.conf.template`](./default.conf.template)
to match.

### 🛠️ Running the production image locally

```sh
docker build -t kompaz-fe .
docker run --rm -p 8080:8080 \
  -e BACKEND_ORIGIN=https://kompaz.frb.io \
  -e BACKEND_HOST=kompaz.frb.io \
  kompaz-fe
```
