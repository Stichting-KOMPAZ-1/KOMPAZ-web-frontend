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
bun run gen
bun run dev
```

### 🟢 OpenAPI

If the api endpoints changed, you need to re-generate the api-related files.

```sh
# Run code generators for API schemas and validators
bun run gen
```

This will read the provided openapi spec and generate some files. These files provide typesafe API clients and form validators.

`openapi.json` is vendored from the backend, which owns the contract. Refresh it from `https://backend.kompaz.igne.link/docs/api.json` and re-run `bun run gen`, so a contract change arrives as a reviewable diff. Never hand-edit it to make the frontend compile.

### 💻 Editor setup

#### Code quality

Most of us [work with VSCode](https://code.visualstudio.com/) or clones thereof. Project settings are applied automatically. Make sure you've installed the [Oxc](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode) editor extension, which covers both linting and formatting.  
You should find it in the "Recommended" section of the extensions tab.

If you use another editor, the same applies: make sure it understands `.oxlintrc.json` and `.oxfmtrc.json`.

#### Claude

The `.claude` folder can be extended per project by specific skills, etc. See Claude docs.  
To overwrite any general settings, create a `settings.local.json` file.

## 🚀 Deployments

### 🔁 Github Workflows

[.github/workflows/ci.yml](.github/workflows/ci.yml) lints and builds every pull request against `main`. There is no deploy workflow yet.

### 🛠️ DIY

If you want to do it yourself, run the following command(s):

```sh
# Install the exact versions of each package specified in the lockfile for reproducible installs.
bun install --frozen-lockfile
# If you are deploying for production, remove the mode parameter
bun run build --mode develop
```

The app is now built in `./dist` and ready to be hosted.

> ⚠️ The app sends its requests to the origin it is hosted on. The backend serves no CORS headers, so a cross-origin deployment cannot work.
>
> The host must therefore reverse proxy `/api` to the backend. In development [`vite.config.ts`](./vite.config.ts) does this, using `VITE_API_PROXY_TARGET` from `.env`.
>
> `VITE_API_BASEURL` is only for the exception: a deployment where the API is genuinely on another origin. It is prepended to paths that already start with `/api`, so it takes an origin and never a path.
