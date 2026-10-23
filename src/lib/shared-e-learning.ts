import type { QueryClient } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import { track } from "lib/analytics";
import { sharedELearningShowThroughModuleOptions } from "lib/heyapi/@tanstack/react-query.gen";

export type ShareSource = "link" | "qr";

type Options = {
	queryClient: QueryClient;
	organizationSlug: string;
	moduleSlug: string;
	eLearningSlug: string;
	source: ShareSource;
	preload: boolean;
};

export async function openSharedELearning({
	queryClient,
	organizationSlug,
	moduleSlug,
	eLearningSlug,
	source,
	preload,
}: Options): Promise<never> {
	const eLearning = await queryClient.ensureQueryData(
		sharedELearningShowThroughModuleOptions({
			path: { organizationSlug, moduleSlug, eLearningSlug },
		}),
	);

	if (!preload) {
		track("elearning_open", {
			organization: organizationSlug,
			elearning: eLearningSlug,
			source,
		});
	}

	throw redirect({
		to: "/e-learnings/$eLearningId",
		params: { eLearningId: eLearning.id },
		replace: true,
	});
}
