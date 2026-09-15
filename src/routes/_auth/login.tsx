import { revalidateLogic } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import {
	createFileRoute,
	Link,
} from "@tanstack/react-router";
import clsx from "clsx";
import { ErrorText } from "components/error-text/error-text";
import { Button, Form } from "components/form";
import { H1 } from "components/heading/heading";
import { useAppForm } from "lib/forms";
import {
	mutateAndValidate,
	normalizeFieldErrors,
} from "lib/forms/validation-helpers";
import type { RequestMagicLinkCommand } from "lib/heyapi";
import { requestMagicLinkMutation } from "lib/heyapi/@tanstack/react-query.gen";
import { zRequestMagicLinkCommand } from "lib/heyapi/zod.gen";
import * as m from "lib/paraglide/messages";
import { makePageTitle } from "lib/title";
import z from "zod";
import style from "./login.module.scss";

const loginSearchSchema = z.object({
	// Set by the _app guard. Carried through redemption once the callback
	// route lands; the link itself travels by email, so it cannot ride along.
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
	const mutation = useMutation({
		...requestMagicLinkMutation(),
		gcTime: 0,
	});

	const form = useAppForm({
		defaultValues: {
			email: "",
		} satisfies RequestMagicLinkCommand,
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: zRequestMagicLinkCommand,
			onSubmitAsync: ({ value }) =>
				mutateAndValidate(mutation, { body: value }),
		},
	});

	if (mutation.isSuccess) {
		return (
			<>
				<H1 size="medium" className={style.textCenter}>
					{m.login_sent_title()}
				</H1>
				<p className={style.textCenter}>
					{m.login_sent_body({
						email: form.state.values.email,
					})}
				</p>
			</>
		);
	}

	return (
		<>
			<H1 size="medium" className={style.textCenter}>
				{m.login_title()}
			</H1>
			<Form
				onSubmit={(evt) => {
					evt.preventDefault();
					form.handleSubmit();
				}}
				className={style.form}
				disabled={mutation.isPending}
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

				<form.Subscribe
					selector={(state) => {
						const errBag = state.errorMap.onSubmit;
						return typeof errBag === "string"
							? errBag
							: errBag?.form;
					}}
				>
					{(formError) => (
						<ErrorText>
							{normalizeFieldErrors(formError)}
						</ErrorText>
					)}
				</form.Subscribe>
				<Button type="submit">{m.login_submit()}</Button>
			</Form>
		</>
	);
}
