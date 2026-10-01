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

export type FormWithState<TState> = {
	store: {
		get: () => TState;
		subscribe: (listener: (value: TState) => void) => {
			unsubscribe: () => void;
		};
	};
};

export const useIsSubmitting = (
	form: FormWithState<{ isSubmitting: boolean }>,
): boolean => useSelector(form.store, (s) => s.isSubmitting);

type FieldMeta = Partial<Record<string, { errors: unknown[] }>>;

const anyFieldFailed = (fieldMeta: FieldMeta): boolean =>
	Object.values(fieldMeta).some(
		(meta) => meta !== undefined && meta.errors.length > 0,
	);

export const useSubmitError = (
	form: FormWithState<{
		isSubmitting: boolean;
		submissionAttempts: number;
		errorMap: { onSubmit?: unknown };
		fieldMeta: FieldMeta;
	}>,
): string | undefined =>
	useSelector(form.store, (s) => {
		if (s.isSubmitting || s.submissionAttempts === 0) {
			return undefined;
		}

		return (
			errorText(s.errorMap.onSubmit) ??
			(anyFieldFailed(s.fieldMeta) ? m.forms_invalid() : undefined)
		);
	});

export const useSubmitAttempts = (
	form: FormWithState<{ submissionAttempts: number }>,
): number => useSelector(form.store, (s) => s.submissionAttempts);

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
