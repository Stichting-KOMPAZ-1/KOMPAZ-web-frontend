import * as path from "node:path";
import { heyApiPlugin } from "@hey-api/vite-plugin";
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import https from "vite-plugin-mkcert";
import svgr from "vite-plugin-svgr";
import viteTsConfigPaths from "vite-tsconfig-paths";
import { name } from "./package.json";
import { translatedPathnames } from "./router-i18n";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");

	return {
		plugins: [
			paraglideVitePlugin({
				project: "./project.inlang",
				outdir: "./src/lib/paraglide",
				strategy: ["url", "localStorage", "baseLocale"],
				emitTsDeclarations: true,
				urlPatterns: translatedPathnames,
				localStorageKey: `${name}-lang`,
			}),
			heyApiPlugin({
				config: {
					input: "./openapi.yaml",
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
				},
			}),
			tanstackRouter({
				autoCodeSplitting: true,
				quoteStyle: "double",
				semicolons: true,
				routeFileIgnorePattern: "\\.module\\.scss",
			}),
			https(),
			react({
				babel: { plugins: ["babel-plugin-react-compiler"] },
			}),
			viteTsConfigPaths(),
			svgr({
				svgrOptions: {
					plugins: [
						"@svgr/plugin-svgo",
						"@svgr/plugin-jsx",
					],
					// svgProps: { fill: "currentColor" }, // enable this with caution, wether it works depends on the icon set used
					svgoConfig: {
						multipass: true,
						floatPrecision: 1,
						plugins: [
							{
								name: "preset-default",
								params: {
									overrides: {
										removeViewBox: false,
									},
								},
							},
						],
					},
				},
			}),
		],
		css: {
			modules: {
				localsConvention: "camelCase",
			},
		},
		build: {
			target: "esnext",
			rollupOptions: {
				output: {
					manualChunks(id) {
						if (
							id.includes("/node_modules/react/") ||
							id.includes("/node_modules/react-dom/") ||
							id.includes("/node_modules/scheduler/")
						) {
							return "vendor-react";
						}
						if (
							id.includes(
								"/node_modules/@tanstack/react-router",
							) ||
							id.includes(
								"/node_modules/@tanstack/router-core",
							) ||
							id.includes("/node_modules/@tanstack/history")
						) {
							return "vendor-router";
						}
						if (
							id.includes(
								"/node_modules/@tanstack/react-query",
							) ||
							id.includes(
								"/node_modules/@tanstack/query-core",
							)
						) {
							return "vendor-query";
						}
						if (
							id.includes("/node_modules/i18next") ||
							id.includes("/node_modules/react-i18next")
						) {
							return "vendor-i18n";
						}
					},
				},
			},
		},
		resolve: {
			// vite-tsconfig-paths doesn't work in SASS files
			alias: [
				{
					find: /^style\/(.*\.(c|s[ac])ss$)/,
					replacement: `${path.resolve(__dirname)}/src/style/$1`,
				},
			],
		},
		server: {
			open: true,
			proxy: {
				[env.VITE_API_BASEURL]: {
					// TODO: Change to your actual backend
					target: "CHANGE_ME",
					secure: true,
					changeOrigin: true,
				},
			},
		},
	};
});
