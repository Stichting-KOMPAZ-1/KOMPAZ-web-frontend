import env from "env";

declare global {
	interface Window {
		dataLayer?: unknown[];
	}
}

export type ConsentChoice = "granted" | "denied";

const CONSENT_STORAGE_KEY = "kompaz.analytics-consent";

/**
 * Hands a command to Google's tag. The tag reads each entry as an `arguments`
 * object rather than an array, so the commands are pushed exactly as gtag.js's
 * own snippet does.
 *
 * @example
 * gtag("event", "page_view", { page_path: "/modules/1" });
 */
function gtag(..._command: unknown[]) {
	window.dataLayer ??= [];
	// oxlint-disable-next-line prefer-rest-params -- gtag.js only recognises the Arguments object
	window.dataLayer.push(arguments);
}

/**
 * Whether Google Analytics is configured for this build. Builds without a
 * measurement ID load nothing and send nothing.
 *
 * @example
 * if (isAnalyticsEnabled()) showConsentBanner();
 */
export function isAnalyticsEnabled(): boolean {
	return env.gaMeasurementId !== "";
}

/**
 * The visitor's stored answer to the consent banner, or `null` when they have
 * not answered yet or the browser keeps no storage.
 *
 * @example
 * const choice = readConsent(); // "granted" | "denied" | null
 */
export function readConsent(): ConsentChoice | null {
	try {
		const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
		return stored === "granted" || stored === "denied" ? stored : null;
	} catch {
		return null;
	}
}

/**
 * Records the visitor's answer and tells the tag. Only `granted` lets Google
 * Analytics store cookies; until then it measures nothing per visitor. Saying
 * no after an earlier yes also removes the cookies that yes left behind, since
 * the tag only stops writing them.
 *
 * @example
 * saveConsent("granted");
 */
export function saveConsent(choice: ConsentChoice): void {
	try {
		window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
	} catch {
		// Without storage the banner asks again on the next visit, which is the safe side.
	}

	if (isAnalyticsEnabled()) {
		gtag("consent", "update", { analytics_storage: choice });
	}

	if (choice === "denied") {
		removeAnalyticsCookies();
	}
}

/**
 * Expires Google Analytics' own cookies (`_ga`, `_ga_<id>`). The tag sets them
 * on the highest domain it is allowed to, so they are expired on this host and
 * on every domain above it; a browser ignores the ones that do not apply.
 *
 * @example
 * removeAnalyticsCookies(); // after consent is withdrawn
 */
export function removeAnalyticsCookies(): void {
	const names = document.cookie
		.split(";")
		.map((cookie) => cookie.split("=")[0]?.trim() ?? "")
		.filter((name) => name === "_ga" || name.startsWith("_ga_"));

	const labels = window.location.hostname.split(".");
	const domains = labels.map((_, index) => labels.slice(index).join("."));

	for (const name of names) {
		document.cookie = `${name}=; Max-Age=0; path=/`;

		for (const domain of domains) {
			document.cookie = `${name}=; Max-Age=0; path=/; domain=.${domain}`;
		}
	}
}

/**
 * Loads Google's tag with every kind of storage denied, then applies an answer
 * the visitor gave on an earlier visit. Advertising storage stays denied for
 * good: the platform shows no ads.
 *
 * @example
 * initAnalytics(); // once, before the app renders
 */
export function initAnalytics(): void {
	if (!isAnalyticsEnabled()) {
		return;
	}

	gtag("consent", "default", {
		analytics_storage: "denied",
		ad_storage: "denied",
		ad_user_data: "denied",
		ad_personalization: "denied",
	});

	const stored = readConsent();

	if (stored !== null) {
		gtag("consent", "update", { analytics_storage: stored });
	}

	gtag("js", new Date());
	// The router reports each page itself; the tag's automatic page view only
	// sees the first load of a single-page app.
	gtag("config", env.gaMeasurementId, { send_page_view: false });

	const script = document.createElement("script");
	script.async = true;
	script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(env.gaMeasurementId)}`;
	document.head.appendChild(script);
}

/**
 * Sends an event to Google Analytics, when it is configured.
 *
 * @example
 * track("elearning_open", { organization: "regio-midden", source: "qr" });
 */
export function track(
	name: string,
	parameters: Record<string, string | number> = {},
): void {
	if (isAnalyticsEnabled()) {
		gtag("event", name, parameters);
	}
}

/**
 * Reports the page the visitor is now on. Called by the router after every
 * navigation.
 *
 * @example
 * trackPageView("/modules/1");
 */
export function trackPageView(path: string): void {
	track("page_view", {
		page_path: path,
		page_location: window.location.href,
		page_title: document.title,
	});
}
