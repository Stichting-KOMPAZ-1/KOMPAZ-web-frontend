import {
	createFileRoute,
	Link,
	redirect,
} from "@tanstack/react-router";
import { H1 } from "components/heading/heading";
import { startSession } from "lib/auth";
import { redeemLoginToken } from "lib/heyapi";
import * as m from "lib/paraglide/messages";
import { makePageTitle } from "lib/title";
import z from "zod";
import style from "./callback.module.scss";

const callbackSearchSchema = z.object({
	token: z.string(),
});

export const Route = createFileRoute("/auth/callback")({
	validateSearch: callbackSearchSchema,
	head: () => ({
		meta: [
			{
				title: makePageTitle(m.login_link_invalid_title()),
			},
		],
	}),
	beforeLoad: async ({ search }) => {
		const { data } = await redeemLoginToken({
			body: { token: search.token },
		});
		// A link that is expired, already used or tampered with lands on the
		// component below instead of throwing an error page at the user.
		if (!data) return;

		startSession(data);
		throw redirect({ to: "/" });
	},
	component: LinkInvalidPage,
});

function LinkInvalidPage() {
	return (
		<div className={style.page}>
			<H1 size="medium">{m.login_link_invalid_title()}</H1>
			<p>{m.login_link_invalid_body()}</p>
			<Link to="/login">{m.login_title()}</Link>
		</div>
	);
}
