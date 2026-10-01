import { createFileRoute, redirect } from "@tanstack/react-router";
import LogoMark from "assets/icons/logo-mark.svg?react";
import { H1 } from "components/heading/heading";
import { LoginForm } from "components/login/login-form";
import { problemDetail } from "lib/api/error-helpers";
import { authRedeem } from "lib/heyapi";
import { authMeOptions } from "lib/heyapi/@tanstack/react-query.gen";
import * as m from "lib/paraglide/messages";
import { makePageTitle } from "lib/title";
import z from "zod";

import style from "./login.module.scss";

const loginSearchSchema = z.object({
	token: z.optional(z.string()),
	redirect: z.optional(z.string().startsWith("/").catch("/")),
});

export const Route = createFileRoute("/_auth/login")({
	validateSearch: loginSearchSchema,
	head: () => ({
		meta: [{ title: makePageTitle(m.login_title()) }],
	}),
	beforeLoad: async ({ context, search }) => {
		if (!search.token) {
			try {
				await context.queryClient.ensureQueryData({
					...authMeOptions(),
					retry: false,
				});
			} catch {
				return { linkError: undefined };
			}
			throw redirect({ to: search.redirect ?? "/" });
		}

		const { data, error } = await authRedeem({ body: { token: search.token } });

		if (!data) {
			return { linkError: problemDetail(error) ?? m.login_link_invalid_body() };
		}

		throw redirect({ to: search.redirect ?? "/" });
	},
	component: LoginPage,
});

function LoginPage() {
	const { linkError } = Route.useRouteContext();

	return (
		<div className={style.login}>
			<div className={style.header}>
				<LogoMark className={style.logo} />
				<H1 size="large" className={style.title}>
					{m.login_title()}
				</H1>
				<p className={style.description}>{m.login_subtitle()}</p>
			</div>

			<LoginForm error={linkError} />
		</div>
	);
}
