import type { QueryClient } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import { track } from "lib/analytics";
import { sharedELearningShowOptions } from "lib/heyapi/@tanstack/react-query.gen";

/** How a visitor reached a shared e-learning: the link, or its QR code. */
export type ShareSource = "link" | "qr";

type Options = {
	queryClient: QueryClient;
	organizationSlug: string;
	eLearningSlug: string;
	source: ShareSource;
	preload: boolean;
};

/**
 * Resolves an organisation's shared e-learning link, records how it was
 * opened, and sends the visitor on to the e-learning page itself.
 *
 * The QR code leads to `/{organisation}/qr/{e-learning}` and the link to
 * `/{organisation}/{e-learning}`, so the route a visitor arrived on is how a
 * scan is told apart from a click. The event is sent here because the redirect
 * means neither address is ever the page a visitor ends up on. A preload sends
 * nothing: nobody opened anything yet.
 *
 * @example
 * loader: ({ context, params, preload }) =>
 *   openSharedELearning({ queryClient: context.queryClient, ...params, source: "qr", preload });
 */
export async function openSharedELearning({
	queryClient,
	organizationSlug,
	eLearningSlug,
	source,
	preload,
}: Options): Promise<never> {
	const eLearning = await queryClient.ensureQueryData(
		sharedELearningShowOptions({ path: { organizationSlug, eLearningSlug } }),
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
