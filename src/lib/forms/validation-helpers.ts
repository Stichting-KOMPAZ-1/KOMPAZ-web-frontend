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
 * Field errors can be multiple types; this normalizes them to strings.
 * TODO: ensure this handles error types for your project.
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
 * Backend returns RFC 9457 problem details with field errors.
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
 * TanStack Form keeps whatever validators returned: our strings or schema
 * `{ message }` objects. This extracts the first as a string.
 *
 * @example
 * errorText(field.state.meta.errors); // => "This field is required"
 */
export const errorText = (error: unknown): string | undefined =>
	normalizeFieldErrors(error).at(0);

/**
 * Show error only if field is touched. `handleSubmit()` touches all fields
 * before validating, so server errors land on first submit. `onChange`
 * validators also show errors once a field is touched.
 *
 * @example
 * visibleError({ isTouched: true, errors: ["This field is required"] });
 * // => "This field is required"
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
