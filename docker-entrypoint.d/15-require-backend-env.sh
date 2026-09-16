#!/bin/sh
# Runs before 20-envsubst-on-templates.sh. Unset values would substitute to an
# empty string and leave `proxy_pass ;` in the config, which nginx rejects with a
# syntax error that says nothing about the missing variable.
set -e

for name in BACKEND_ORIGIN BACKEND_HOST; do
	eval "value=\$$name"
	if [ -z "$value" ]; then
		echo "error: $name is not set. It must be a RUN_TIME env var on the app (see .do/app.production.yaml)." >&2
		exit 1
	fi
done
