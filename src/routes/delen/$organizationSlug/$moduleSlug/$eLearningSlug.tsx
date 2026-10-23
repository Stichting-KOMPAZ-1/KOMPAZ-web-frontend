import { createFileRoute } from "@tanstack/react-router";
import PageError from "components/page/page-error";
import PageLoading from "components/page/page-loading";
import * as m from "lib/paraglide/messages";
import { openSharedELearning } from "lib/shared-e-learning";
import z from "zod";

export const Route = createFileRoute(
	"/delen/$organizationSlug/$moduleSlug/$eLearningSlug",
)({
	validateSearch: z.object({ utm_source: z.optional(z.string()) }),
	loaderDeps: ({ search }) => ({ source: search.utm_source }),
	loader: ({ context, params, deps, preload }) =>
		openSharedELearning({
			queryClient: context.queryClient,
			...params,
			source: deps.source === "qr" ? "qr" : "link",
			preload,
		}),
	errorComponent: () => (
		<PageError>{m.shared_elearning_unavailable()}</PageError>
	),
	pendingComponent: PageLoading,
});
