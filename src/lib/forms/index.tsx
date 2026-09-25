import { createFormHook, useSelector } from "@tanstack/react-form";
import Checkbox from "components/form/checkbox/tsf-checkbox";
import CheckboxGroup from "components/form/checkbox/tsf-checkbox-group";
import Input from "components/form/input/tsf-input";
import RadioGroup from "components/form/radio-group/tsf-radio-group";
import Select from "components/form/select/tsf-select";
import Textarea from "components/form/textarea/tsf-textarea";
import * as m from "lib/paraglide/messages";
import type { SubmitEvent } from "react";

import { fieldContext, formContext } from "./form-context";
import { errorText } from "./validation-helpers";

export { fieldContext, formContext, useFieldContext } from "./form-context";

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
	fieldContext,
	formContext,

	fieldComponents: {
		Checkbox,
		CheckboxGroup,
		Input,
		RadioGroup,
		Select,
		Textarea,
	},
	formComponents: {},
});

// The form's store conforms to any shape via TState.
export type FormWithState<TState> = {
	store: {
		get: () => TState;
		subscribe: (listener: (value: TState) => void) => {
			unsubscribe: () => void;
		};
	};
};

/**
 * Whether the form is mid-submit. Use it for feedback — a pending label on the
 * button, a spinner.
 *
 * Do not wire it to `<Form disabled>`: disabling the fieldset blurs whatever
 * was focused, and `submitHandler` already drops a re-submit, so freezing the
 * form buys nothing.
 *
 * @example
 * const isSubmitting = useIsSubmitting(form);
 * // => false
 */
export const useIsSubmitting = (
	form: FormWithState<{ isSubmitting: boolean }>,
): boolean => useSelector(form.store, (s) => s.isSubmitting);

/**
 * The message under the submit button after a failed submit.
 *
 * @example
 * const error = useSubmitError(form);
 * // => "Some fields need attention. Check the messages above."
 */
export const useSubmitError = (
	form: FormWithState<{
		isSubmitting: boolean;
		submissionAttempts: number;
		errorMap: { onSubmit?: unknown };
		fieldMeta: Partial<Record<string, { errors: unknown[] }>>;
	}>,
): string | undefined =>
	useSelector(form.store, (s) => {
		if (s.isSubmitting || s.submissionAttempts === 0) {
			return undefined;
		}

		const hasFieldError = Object.values(s.fieldMeta).some(
			(meta) => meta !== undefined && meta.errors.length > 0,
		);

		return (
			errorText(s.errorMap.onSubmit) ??
			(hasFieldError ? m.forms_invalid() : undefined)
		);
	});

/**
 * How many times a submit has been attempted. `SubmitError` keys its content
 * on this so a repeated, byte-identical message still re-announces: a live
 * region only speaks when its content actually changes.
 *
 * @example
 * const attempts = useSubmitAttempts(form);
 * // => 2
 */
export const useSubmitAttempts = (
	form: FormWithState<{ submissionAttempts: number }>,
): number => useSelector(form.store, (s) => s.submissionAttempts);

/**
 * The `onSubmit` for a `<Form>`: stops the browser from navigating and hands
 * the submit to the form.
 *
 * @example
 * <Form onSubmit={submitHandler(form)}>
 */
export const submitHandler =
	(form: {
		handleSubmit: () => Promise<void>;
		state: { isSubmitting: boolean };
	}) =>
	async (evt: SubmitEvent<HTMLFormElement>) => {
		evt.preventDefault();
		evt.stopPropagation();

		if (form.state.isSubmitting) {
			return;
		}

		await form.handleSubmit();
	};
