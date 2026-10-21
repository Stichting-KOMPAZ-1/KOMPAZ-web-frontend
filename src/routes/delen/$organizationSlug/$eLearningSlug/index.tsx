import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	ELearningNavigationContext,
	publicELearningNavigation,
} from "components/e-learning/e-learning-navigation";
import ELearningOverview from "components/e-learning/e-learning-overview";
import PageError from "components/page/page-error";
import PageLoading from "components/page/page-loading";
import { track } from "lib/analytics";
import type { ModuleContactResource } from "lib/heyapi";
import { sharedELearningShowOptions } from "lib/heyapi/@tanstack/react-query.gen";
import * as m from "lib/paraglide/messages";
import { makePageTitle } from "lib/title";
import z from "zod";

import style from "./index.module.scss";

// TODO: Whether the contacts are provided or fetched additionally is a question in KOM-110
const noContacts: readonly ModuleContactResource[] = [];

export const Route = createFileRoute(
	"/delen/$organizationSlug/$eLearningSlug/",
)({
	validateSearch: z.object({
		utm_source: z.optional(z.string()),
		utm_medium: z.optional(z.string()),
	}),
	loaderDeps: ({ search }) => ({ source: search.utm_source }),
	staleTime: Infinity,
	loader: async ({ context, params, deps, preload }) => {
		const eLearning = await context.queryClient.ensureQueryData(
			sharedELearningShowOptions({ path: params }),
		);

		if (!preload) {
			track("elearning_open", {
				organization: params.organizationSlug,
				elearning: params.eLearningSlug,
				source: deps.source === "qr" ? "qr" : "link",
			});
		}

		return eLearning;
	},
	head: ({ loaderData }) => ({
		meta: [{ title: makePageTitle(loaderData?.name ?? "") }],
	}),
	errorComponent: () => (
		<PageError>{m.shared_elearning_unavailable()}</PageError>
	),
	pendingComponent: PageLoading,
	component: SharedELearningPage,
});

function SharedELearningPage() {
	const { organizationSlug, eLearningSlug } = Route.useParams();
	const { data: eLearning } = useSuspenseQuery(
		sharedELearningShowOptions({ path: { organizationSlug, eLearningSlug } }),
	);

	return (
		<ELearningNavigationContext
			value={publicELearningNavigation(organizationSlug, eLearningSlug)}
		>
			<div className={style.page}>
				<ELearningOverview eLearning={eLearning} contacts={noContacts} />
			</div>
		</ELearningNavigationContext>
	);
}
