# syntax=docker/dockerfile:1

# --- Build stage: Bun builds the Vite SPA ---
FROM oven/bun:1.3.10 AS build
WORKDIR /app

# Vite inlines configuration into the bundle, so anything the app reads through
# import.meta.env has to be present here, not at container start. App Platform
# passes BUILD_TIME env vars to the Dockerfile build as build args.
#   VITE_API_BASEURL - path the app sends API requests to. Stays a same-origin
#                      path; the proxy in front sends it to the backend
#                      (proxy/proxy.json).
#   VITE_API_ORIGIN  - backend the API client is generated from, at build time
#                      only: the bundle never calls it directly.
#   VITE_GA_MEASUREMENT_ID - Google Analytics 4 measurement ID; empty loads none.
ARG VITE_API_BASEURL=/api
ARG VITE_API_ORIGIN
ARG VITE_GA_MEASUREMENT_ID=

# No lifecycle scripts in the image. The one that matters is `prepare`, which
# installs the git hooks: there is no git here and no repository to hook into
# (.git is in .dockerignore), so it failed every build. `bun run build` installs
# again itself, which is why the flag here is not enough on its own and the
# project's bunfig says so too once it has been copied in.
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --ignore-scripts

COPY . .
RUN sed -i '/^\[install\]/a ignoreScripts = true' bunfig.toml

RUN printf 'VITE_API_BASEURL=%s\nVITE_API_ORIGIN=%s\nVITE_GA_MEASUREMENT_ID=%s\n' "$VITE_API_BASEURL" "$VITE_API_ORIGIN" "$VITE_GA_MEASUREMENT_ID" > .env

# The Vite plugins emit the API client (src/lib/heyapi) and the paraglide
# messages (src/lib/paraglide) as part of this build, which is why neither is
# committed and why nothing has to be generated before it.
RUN bun run build

# --- Serve stage: nginx serves the build with its headers ---
# Only the SPA: the proxy in front (proxy/proxy.json) sends the backend's paths
# to the backend, so this image needs no backend address and serves any
# environment as built.
FROM nginx:1.27-alpine

COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
