import { revalidateLogic } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Form, FormButton, SubmitError } from "components/form";
import Icon from "components/icon/icon";
import SystemMessage from "components/system-message/system-message";
import {
	submitHandler,
	useAppForm,
	useIsSubmitting,
	useSubmitAttempts,
} from "lib/forms";
import { mutateAndValidate } from "lib/forms/validation-helpers";
import type { RequestMagicLinkRequest } from "lib/heyapi";
import { authRequestMagicLinkMutation } from "lib/heyapi/@tanstack/react-query.gen";
import { zRequestMagicLinkRequest } from "lib/heyapi/zod.gen";
import * as m from "lib/paraglide/messages";

import style from "./login-form.module.scss";

type Props = {
	error?: string;
};

export function LoginForm({ error }: Props) {
	const mutation = useMutation({
		...authRequestMagicLinkMutation(),
		gcTime: 0,
	});

	const form = useAppForm({
		defaultValues: {
			email: "",
		} satisfies RequestMagicLinkRequest,
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: zRequestMagicLinkRequest,
			onSubmitAsync: ({ value }) =>
				mutateAndValidate(mutation, { body: value }),
		},
	});

	const isSubmitting = useIsSubmitting(form);
	const attempts = useSubmitAttempts(form);

	return (
		<>
			{attempts === 0 && error !== undefined && (
				<SystemMessage variant="error">{error}</SystemMessage>
			)}

			<output className={style.sentRegion}>
				{mutation.isSuccess && (
					<SystemMessage variant="success">
						{m.login_sent_body({ email: form.state.values.email })}
					</SystemMessage>
				)}
			</output>

			<Form
				label={m.login_form_label()}
				onSubmit={submitHandler(form)}
				className={style.form}
			>
				<form.AppField name="email">
					{(field) => (
						<field.Input
							label={m.login_email()}
							type="email"
							autoComplete="email"
							placeholder={m.login_email_placeholder()}
							required
						/>
					)}
				</form.AppField>

				<FormButton
					isSubmitting={isSubmitting}
					loadingLabel={m.login_submitting()}
					size="large"
					className={style.submit}
				>
					<Icon name="mail" />
					{m.login_submit()}
				</FormButton>
				<SubmitError form={form} hideWhenFieldsFail />
			</Form>
		</>
	);
}

export default LoginForm;
