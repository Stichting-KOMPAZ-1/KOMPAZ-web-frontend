# syntax=docker/dockerfile:1

# --- Build stage: Bun builds the Vite SPA ---
FROM oven/bun:1.3.10 AS build
WORKDIR /app

# Vite inlines configuration into the bundle, so anything the app reads through
# import.meta.env has to be present here, not at container start. App Platform
# passes BUILD_TIME env vars to the Dockerfile build as build args.
#   VITE_API_BASEURL - path the app sends API requests to. Stays a same-origin
#                      path; nginx proxies it to the backend (default.conf.template).
ARG VITE_API_BASEURL=/api

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

RUN printf 'VITE_API_BASEURL=%s\n' "$VITE_API_BASEURL" > .env

# The Vite plugins emit the API client (src/lib/heyapi) and the paraglide
# messages (src/lib/paraglide) as part of this build, which is why neither is
# committed and why nothing has to be generated before it.
RUN bun run build

# --- Serve stage: nginx serves the build and proxies the API ---
FROM nginx:1.27-alpine

# Where /api is proxied. Runtime rather than build-time on purpose: the bundle
# only ever knows the relative path, so one image can serve any environment.
#   BACKEND_ORIGIN - scheme + host, e.g. https://kompaz.frb.io
#   BACKEND_HOST   - bare host, for the Host header and TLS SNI
ENV BACKEND_ORIGIN=""
ENV BACKEND_HOST=""
# Substitute only these two. nginx's own runtime variables ($uri, $status,
# $remote_addr, ...) share the ${} syntax and must survive envsubst untouched.
ENV NGINX_ENVSUBST_FILTER="^BACKEND_"

COPY docker-entrypoint.d/ /docker-entrypoint.d/
COPY default.conf.template proxy-backend.inc.template /etc/nginx/templates/
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
