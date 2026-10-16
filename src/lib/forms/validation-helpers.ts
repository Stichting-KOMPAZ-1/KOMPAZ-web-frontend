import { parseErrorString } from "lib/api/error-helpers";
import * as z from "zod";

export const zValidationProblemDetails = z.object({
	title: z.string(),
	errors: z.optional(z.record(z.string(), z.array(z.string()))),
});

export type ValidationProblemDetails = z.infer<
	typeof zValidationProblemDetails
>;

// TODO: make sure this can handle the error types for your project
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

// The backend returns rfc9457 problem details:
// https://datatracker.ietf.org/doc/html/rfc9457#name-the-problem-details-json-ob
export const apiErrorToFormErrors = (error: unknown) => {
	const parsed = zValidationProblemDetails.safeParse(error);
	const fields = parsed.success ? (parsed.data.errors ?? {}) : {};

	return {
		form: parsed.success ? parsed.data.title : parseErrorString(error),
		fields,
	};
};

export const errorText = (error: unknown): string | undefined =>
	normalizeFieldErrors(error).at(0);

export const visibleError = (meta: {
	isTouched: boolean;
	errors: unknown[];
}): string | undefined => (meta.isTouched ? errorText(meta.errors) : undefined);

type Mutatable<TVariables> = {
	mutateAsync: (variables: TVariables) => Promise<unknown>;
};

// TODO: drop once TanStack Form supports this natively:
// https://github.com/TanStack/form/issues/2188
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
