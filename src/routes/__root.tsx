import {
	createRootRouteWithContext,
	ErrorComponent,
	HeadContent,
	Outlet,
	redirect,
	Scripts,
} from "@tanstack/react-router";
import { H1 } from "components/heading/heading";
import * as m from "lib/paraglide/messages";
import {
	baseLocale,
	getUrlOrigin,
	localizeHref,
	shouldRedirect,
} from "lib/paraglide/runtime";
import type { RouterContext } from "lib/router";

import style from "./not-found.module.scss";

const NotFoundPage = () => (
	<H1 size="medium" className={style.page}>
		{m.not_found_title()}
	</H1>
);

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
	notFoundComponent: NotFoundPage,
});
