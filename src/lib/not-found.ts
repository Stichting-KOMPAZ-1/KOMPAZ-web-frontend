import { notFound } from "@tanstack/react-router";
import { problemStatus } from "lib/api/error-helpers";

export const notFoundOn404 = (error: unknown): never => {
	if (problemStatus(error) === 404) throw notFound({ data: error });
	throw error;
};
