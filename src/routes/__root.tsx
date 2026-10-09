import {
	createRootRouteWithContext,
	ErrorComponent,
	HeadContent,
	Outlet,
	redirect,
	Scripts,
} from "@tanstack/react-router";
import PageNotFound from "components/page/page-not-found";
import {
	baseLocale,
	getUrlOrigin,
	localizeHref,
	shouldRedirect,
} from "lib/paraglide/runtime";
import type { RouterContext } from "lib/router";

export const Route = createRootRouteWithContext<RouterContext>()({
	head: ({ matches }) => {
		const pathname = matches.at(-1)?.pathname ?? "/";
		return {
			links: [
				{
					rel: "canonical",
					href:
						getUrlOrigin() +
						localizeHref(pathname, {
							locale: baseLocale,
						}),
				},
			],
		};
	},
	beforeLoad: async () => {
		const decision = await shouldRedirect({
			url: window.location.href,
		});
		if (decision.redirectUrl) {
			throw redirect({ href: decision.redirectUrl.href });
		}
	},
	component: () => (
		<>
			<HeadContent />
			<Outlet />
			<Scripts />
		</>
	),
	errorComponent: (error) => <ErrorComponent error={error} />,
	notFoundComponent: PageNotFound,
});
