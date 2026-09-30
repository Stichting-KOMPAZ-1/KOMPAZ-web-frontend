import * as m from "lib/paraglide/messages";

/**
 * An error message pulled out of an unknown value.
 * TODO: Update this to accomodate (changes in) the project
 *
 * @example
 * parseErrorString(new Error("Boom")); // => "Boom"
 */
export const parseErrorString = (value: unknown, fallback?: string): string => {
	const unknownError = fallback || m.error_unknown();
	if (!value) return unknownError;
	if (typeof value === "string") return value;
	if (typeof value === "object" && "message" in value && value.message) {
		return String(value.message);
	}
	return unknownError;
};
