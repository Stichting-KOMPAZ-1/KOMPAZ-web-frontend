import { createFileRoute } from "@tanstack/react-router";
import { H1 } from "components/heading/heading";
import * as m from "lib/paraglide/messages";
import { makePageTitle } from "lib/title";
import style from "./forgot-password.module.scss";

export const Route = createFileRoute(
	"/_auth/forgot-password",
)({
	head: () => ({
		meta: [
			{ title: makePageTitle(m.forgot_password_title()) },
		],
	}),
	component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
	return (
		<H1 size="medium" className={style.textCenter}>
			{m.forgot_password_title()}
		</H1>
	);
}
