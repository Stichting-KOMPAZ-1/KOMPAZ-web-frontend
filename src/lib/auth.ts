import env from "env";

const CSRF_COOKIE = "XSRF-TOKEN";
const CSRF_COOKIE_PATTERN = new RegExp(`(?:^|;\\s*)${CSRF_COOKIE}=([^;]*)`);

export const CSRF_HEADER = "X-XSRF-TOKEN";

/**
 * The CSRF token to echo back, or null until the cookie has been issued.
 *
 * @example
 * readCsrfToken(); // "eyJpdiI6..." | null
 */
export const readCsrfToken = () => {
	const match = document.cookie.match(CSRF_COOKIE_PATTERN);
	return match?.[1] ? decodeURIComponent(match[1]) : null;
};

let pendingCsrfCookie: Promise<void> | null = null;

/**
 * Fetches the CSRF cookie unless the browser already holds one. Concurrent
 * callers share a single request.
 *
 * @example
 * await ensureCsrfCookie();
 * readCsrfToken(); // "eyJpdiI6..."
 */
export const ensureCsrfCookie = async () => {
	if (readCsrfToken()) return;
	pendingCsrfCookie ??= (async () => {
		try {
			await fetch(env.apiCsrfPath, { credentials: "include" });
		} finally {
			pendingCsrfCookie = null;
		}
	})();
	await pendingCsrfCookie;
};
