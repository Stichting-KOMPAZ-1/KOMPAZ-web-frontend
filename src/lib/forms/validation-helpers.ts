import { parseErrorString } from "lib/api/error-helpers";
import * as z from "zod";

export const zValidationProblemDetails = z.object({
	title: z.string(),
	errors: z.optional(z.record(z.string(), z.array(z.string()))),
});

export type ValidationProblemDetails = z.infer<
	typeof zValidationProblemDetails
>;

/**
 * Every error in a field's `meta.errors`, as strings.
 * TODO: make sure this can handle the error types for your project
 *
 * @example
 * normalizeFieldErrors([{ message: "Required" }]); // => ["Required"]
 */
export const normalizeFieldErrors = (errors: unknown): string[] => {
	const errorArray = Array.isArray(errors) ? errors : [errors];
	return errorArray.flatMap((error) => {
		if (typeof error === "string") return [error];
		if (
			error &&
			typeof error === "object" &&
			"message" in error &&
			typeof error.message === "string"
		)
			return [error.message];
		return [];
	});
};

/**
 * Every error across the given fields, as strings.
 *
 * @example
 * getFieldErrors(form.state, ["street", "houseNumber"]);
 * // => ["This field is required"]
 */
export const getFieldErrors = <
	TState extends {
		fieldMeta: Record<string, { errors: unknown } | undefined>;
	},
	TField extends keyof TState["fieldMeta"],
>(
	state: TState,
	fields: TField[],
): string[] =>
	fields.flatMap((field) =>
		normalizeFieldErrors(state.fieldMeta[field]?.errors),
	);

/**
 * Transform api error to form error.
 * The backend returns rfc9457 problem details:
 * https://datatracker.ietf.org/doc/html/rfc9457#name-the-problem-details-json-ob
 */
export const apiErrorToFormErrors = (error: unknown) => {
	const parsed = zValidationProblemDetails.safeParse(error);
	const fields = parsed.success ? (parsed.data.errors ?? {}) : {};

	return {
		form: parsed.success ? parsed.data.title : parseErrorString(error),
		fields,
	};
};

/**
 * The first error as a string.
 *
 * @example
 * errorText(field.state.meta.errors); // => "This field is required"
 * errorText(undefined); // => undefined
 */
export const errorText = (error: unknown): string | undefined =>
	normalizeFieldErrors(error).at(0);

/**
 * The field's error, or `undefined` until it has been touched.
 *
 * @example
 * visibleError({ isTouched: true, errors: ["This field is required"] });
 * // => "This field is required"
 * visibleError({ isTouched: false, errors: ["This field is required"] });
 * // => undefined
 */
export const visibleError = (meta: {
	isTouched: boolean;
	errors: unknown[];
}): string | undefined => (meta.isTouched ? errorText(meta.errors) : undefined);

type Mutatable<TVariables> = {
	mutateAsync: (variables: TVariables) => Promise<unknown>;
};

/**
 * Runs a mutation and turns a rejection into form errors.
 * TODO: drop once TanStack Form supports this natively:
 *   https://github.com/TanStack/form/issues/2188
 *
 * @example
 * validators: {
 *   onSubmitAsync: async ({ value }) =>
 *     mutateAndValidate(mutation, { body: value }),
 * }
 */
export const mutateAndValidate = async <TVariables>(
	mutation: Mutatable<TVariables>,
	variables: TVariables,
) => {
	try {
		await mutation.mutateAsync(variables);
	} catch (error) {
		return apiErrorToFormErrors(error);
	}
};
