const APP_NAME = "KOMPAZ";
const DELIMITER = "·";

/**
 * Appends the app name to a page title.
 *
 * @example
 * makePageTitle("Login") // "Login · KOMPAZ"
 */
export const makePageTitle = (pageTitle: string): string =>
	[pageTitle, DELIMITER, APP_NAME].join(" ");
