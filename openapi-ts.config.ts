import type { UserConfig } from "@hey-api/openapi-ts";

// Single source of truth for hey-api codegen. Read by the CLI (`bun run gen`,
// which finds this file by name) and by the Vite plugin in vite.config.ts, so a
// standalone generate and a dev/build run can never drift apart.
//
// Deliberately a plain object rather than hey-api's defineConfig(): that helper
// is async, so exporting its result hands the Vite plugin a Promise and codegen
// fails with "missing input".
export default {
	input: "./openapi.json",
	output: "src/lib/heyapi",
	plugins: [
		"@hey-api/typescript",
		"@tanstack/react-query",
		{
			name: "@hey-api/sdk",
			// validator: true, // optional: https://heyapi.dev/openapi-ts/plugins/sdk#validators
		},
		"zod",
	],
} satisfies UserConfig;
