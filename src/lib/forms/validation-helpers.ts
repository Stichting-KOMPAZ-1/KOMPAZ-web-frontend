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
 * Field errors can be of multiple types. This transforms to an array of strings.
 * TODO: make sure this can handle the error types for your project
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
 * Returns a flattened array of error from given fields
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
		// A submit validator that returns nothing truthy counts as a pass, which
		// would let a failure the parser doesn't recognize (a 500, a dropped
		// connection) through as a successful submit — hence the fallback.
		// `fields` is always present so TanStack Form recognizes the result as a
		// form-level error it should spread over the individual fields.
		form: parsed.success ? parsed.data.title : parseErrorString(error),
		fields,
	};
};

/**
 * The message to display for one error slot. TanStack Form keeps whatever the
 * validator returned, so an entry is one of our own strings for submit/server
 * errors, or a `{ message }` issue when a schema validator produced it.
 * Accepts a single error or a field's whole `meta.errors` list.
 *
 * @example
 * errorText(field.state.meta.errors); // => "This field is required"
 * errorText(undefined); // => undefined
 */
export const errorText = (error: unknown): string | undefined =>
	normalizeFieldErrors(error).at(0);

/**
 * The error to show for a field, or `undefined` while it should stay hidden.
 * A field counts as touched from its first keystroke, and `handleSubmit()`
 * touches every field before validating, so a server error lands on the first
 * submit. The gate only bites once a field carries an `onChange` validator:
 * until then nothing produces an error before submit anyway.
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

// Instead of using `UseMutationResult` we use this custom type, so it
// can be used by other means than react-query and is easier to mock.
type Mutatable<TVariables> = {
	mutateAsync: (variables: TVariables) => Promise<unknown>;
};

/**
 * Submit form and handle possible errors.
 * This is a temporary solution until TSF supports it out of the box:
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
