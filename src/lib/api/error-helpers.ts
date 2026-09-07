/**
 * Try to get an error message from an unknown value
 * Useful for catch situations or poorly typed api's
 * TODO: Update this to accomodate (changes in) the project
 */
export const parseErrorString = (
	value: unknown,
	fallback?: string,
): string => {
	const unknownError = fallback || "Onbekende fout.";
	if (!value) return unknownError;
	if (typeof value === "string") return value;
	if (
		typeof value === "object" &&
		"message" in value &&
		value.message
	) {
		return String(value.message);
	}
	return unknownError;
};
