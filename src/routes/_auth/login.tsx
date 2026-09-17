import { revalidateLogic } from "@tanstack/react-form";
import {
	createFileRoute,
	Link,
} from "@tanstack/react-router";
import clsx from "clsx";
import { ErrorText } from "components/error-text/error-text";
import { Button, Form } from "components/form";
import { H1 } from "components/heading/heading";
import { useAppForm } from "lib/forms";
import * as m from "lib/paraglide/messages";
import { makePageTitle } from "lib/title";
import z from "zod";

import style from "./login.module.scss";

const requestLinkSchema = z.object({
	email: z.email(),
});

const loginSearchSchema = z.object({
	// Nothing sets this today — the _app guard that did is gone with the rest of
	// auth. Kept so the route keeps accepting it when a guard returns.
	redirect: z.optional(
		z.string().startsWith("/").catch("/"),
	),
});

export const Route = createFileRoute("/_auth/login")({
	validateSearch: loginSearchSchema,
	head: () => ({
		meta: [{ title: makePageTitle(m.login_title()) }],
	}),
	component: LoginPage,
});

function LoginPage() {
	const form = useAppForm({
		defaultValues: {
			email: "",
		},
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: requestLinkSchema,
		},
	});

	return (
		<>
			<H1 size="medium" className={style.textCenter}>
				{m.login_title()}
			</H1>
			<Form
				onSubmit={(evt) => evt.preventDefault()}
				className={style.form}
				disabled
			>
				<div className={style.label}>
					<form.AppField name="email">
						{(field) => (
							<field.Input
								label={m.login_email()}
								autoComplete="email"
								required
							/>
						)}
					</form.AppField>
					<Link
						to="/forgot-password"
						className={clsx([style.forgotPassword])}
					>
						{m.login_forgot_password()}
					</Link>
				</div>

				<ErrorText>{m.login_unavailable()}</ErrorText>
				<Button type="submit">{m.login_submit()}</Button>
			</Form>
		</>
	);
}
