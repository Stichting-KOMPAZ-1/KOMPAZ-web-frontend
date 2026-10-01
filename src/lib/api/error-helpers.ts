import * as m from "lib/paraglide/messages";
import * as z from "zod";

// TODO: Update this to accomodate (changes in) the project
export const parseErrorString = (value: unknown, fallback?: string): string => {
	const unknownError = fallback || m.error_unknown();
	if (!value) return unknownError;
	if (typeof value === "string") return value;
	if (typeof value === "object" && "message" in value && value.message) {
		return String(value.message);
	}
	return unknownError;
};

const zProblemDetail = z.object({ detail: z.string().min(1) });

/**
 * The sentence an RFC 9457 problem document writes for the person using the
 * product, as opposed to `title`, which names the HTTP status.
 *
 * @example
 * problemDetail({ title: "Unauthorized", detail: "Deze inloglink is ongeldig." });
 * // => "Deze inloglink is ongeldig."
 */
export const problemDetail = (error: unknown): string | undefined => {
	const parsed = zProblemDetail.safeParse(error);
	return parsed.success ? parsed.data.detail : undefined;
};
