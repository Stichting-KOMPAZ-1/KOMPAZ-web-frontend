import { createFileRoute } from "@tanstack/react-router";
import PageError from "components/page/page-error";
import PageLoading from "components/page/page-loading";
import * as m from "lib/paraglide/messages";
import { openSharedELearning } from "lib/shared-e-learning";

export const Route = createFileRoute("/$organizationSlug/$eLearningSlug")({
	loader: ({ context, params, preload }) =>
		openSharedELearning({
			queryClient: context.queryClient,
			...params,
			source: "link",
			preload,
		}),
	errorComponent: () => (
		<PageError>{m.shared_elearning_unavailable()}</PageError>
	),
	pendingComponent: PageLoading,
});
