import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import LogoMark from "assets/icons/logo-mark.svg?react";
import Button from "components/button/button";
import { H1 } from "components/heading/heading";
import { LoginForm } from "components/login/login-form";
import { problemDetail } from "lib/api/error-helpers";
import {
	authMeOptions,
	authRedeemMutation,
} from "lib/heyapi/@tanstack/react-query.gen";
import * as m from "lib/paraglide/messages";
import { makePageTitle } from "lib/title";
import { useEffect, useState } from "react";
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
		if (search.token) return;

		try {
			await context.queryClient.ensureQueryData({
				...authMeOptions(),
				retry: false,
			});
		} catch {
			return;
		}

		throw redirect({ to: search.redirect ?? "/" });
	},
	component: LoginPage,
});

function LoginPage() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();
	const queryClient = useQueryClient();
	const [token] = useState(search.token);

	const redeem = useMutation({
		...authRedeemMutation(),
		gcTime: 0,
		onSuccess: async () => {
			queryClient.clear();
			await navigate({ to: search.redirect ?? "/" });
		},
	});

	useEffect(() => {
		if (search.token === undefined) return;
		void navigate({
			search: (previous) => ({ ...previous, token: undefined }),
			replace: true,
		});
	}, [search.token, navigate]);

	const isLinkPending = token !== undefined && !redeem.isError;

	return (
		<div className={style.login}>
			<div className={style.header}>
				<LogoMark className={style.logo} />
				<H1 size="20-24" className={style.title}>
					{isLinkPending ? m.login_link_title() : m.login_title()}
				</H1>
				<p className={style.description}>
					{isLinkPending ? m.login_link_subtitle() : m.login_subtitle()}
				</p>
			</div>

			{isLinkPending ? (
				<Button
					size="large"
					className={style.redeem}
					disabled={redeem.isPending}
					focusableWhenDisabled
					onClick={() => redeem.mutate({ body: { token } })}
				>
					{redeem.isPending ? m.login_link_submitting() : m.login_link_submit()}
				</Button>
			) : (
				<LoginForm
					error={
						redeem.isError
							? (problemDetail(redeem.error) ?? m.login_link_invalid_body())
							: undefined
					}
				/>
			)}
		</div>
	);
}
