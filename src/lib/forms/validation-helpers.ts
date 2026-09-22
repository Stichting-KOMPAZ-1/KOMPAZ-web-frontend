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
	if (parsed.success) {
		return {
			form: parsed.data.title,
			fields: parsed.data.errors ?? {},
		};
	}
	return { form: parseErrorString(error) };
};

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
