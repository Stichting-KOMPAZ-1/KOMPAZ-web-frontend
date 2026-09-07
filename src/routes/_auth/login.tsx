import { revalidateLogic } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import {
	createFileRoute,
	Link,
	useNavigate,
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
import type { LoginRequest } from "lib/heyapi";
import { postApiAuthLoginMutation } from "lib/heyapi/@tanstack/react-query.gen";
import { zLoginRequest } from "lib/heyapi/zod.gen";
import * as m from "lib/paraglide/messages";
import { makePageTitle } from "lib/title";
import z from "zod";
import style from "./login.module.scss";

const loginSearchSchema = z.object({
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
	const { redirect } = Route.useSearch();
	const navigate = useNavigate();

	const mutation = useMutation({
		...postApiAuthLoginMutation(),
		gcTime: 0,
		onSuccess: () => navigate({ to: redirect || "/" }),
	});

	const form = useAppForm({
		defaultValues: {
			email: "",
			password: "",
		} satisfies LoginRequest,
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: zLoginRequest,
			onSubmitAsync: ({ value }) =>
				mutateAndValidate(mutation, { body: value }),
		},
	});

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
				<form.AppField name="email">
					{(field) => (
						<field.Input
							label={m.login_email()}
							autoComplete="email"
						/>
					)}
				</form.AppField>
				<div className={style.label}>
					<form.AppField name="password">
						{(field) => (
							<field.Input
								type="password"
								label={m.login_password()}
								autoComplete="current-password"
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
