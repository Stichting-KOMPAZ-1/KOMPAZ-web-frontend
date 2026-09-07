// Note: this file is only used build-time
// Taken from https://paraglidejs.com/tanstack-router#typesafe-translated-pathnames
// But with required route paths

import type { Locale } from "./src/lib/paraglide/runtime";
import type { FileRoutesByTo } from "./src/routeTree.gen";

// All registered route paths.
type RoutePath = keyof FileRoutesByTo;

// All route paths that need to be translated.
// Index paths are excluded. Add any others that need exclusion.
type RequiredRoutePath = Exclude<RoutePath, `${string}/`>;

type TranslatedPathname = {
	pattern: string;
	localized: Array<[Locale, string]>;
};

function toUrlPattern(path: string): string {
	return path
		.replace(/\/\$$/, "/:path(.*)?")
		.replace(/\{-\$([a-zA-Z0-9_]+)\}/g, ":$1?")
		.replace(/\$([a-zA-Z0-9_]+)/g, ":$1")
		.replace(/\/+$/, "");
}

function createTranslatedPathnames(
	input: Record<RequiredRoutePath, Record<Locale, string>> &
		Partial<Record<RoutePath, Record<Locale, string>>>,
): TranslatedPathname[] {
	return Object.entries(input).map(
		([pattern, locales]) => ({
			pattern: toUrlPattern(pattern),
			localized: Object.entries(locales ?? {}).map(
				([locale, path]) =>
					[locale as Locale, toUrlPattern(path)] satisfies [
						Locale,
						string,
					],
			),
		}),
	);
}

/**
 * Add a route's translations here, keyed by its router path.
 */
export const translatedPathnames =
	createTranslatedPathnames({
		"/login": {
			"en-US": "/login",
			"nl-NL": "/inloggen",
		},
		"/forgot-password": {
			"en-US": "/forgot-password",
			"nl-NL": "/wachtwoord-vergeten",
		},
		"/form-example": {
			"en-US": "/form-example",
			"nl-NL": "/formulier-voorbeeld",
		},
	});
