import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, retainSearchParams } from "@tanstack/react-router";
import { overviewLink } from "components/e-learning/e-learning-utils";
import AppHeader from "components/header/app-header";
import SharedHeader from "components/header/shared-header";
import AppLayout from "layouts/app-layout/app-layout";
import {
	authMeOptions,
	sharedELearningShowThroughModuleOptions,
} from "lib/heyapi/@tanstack/react-query.gen";
import z from "zod";

export const Route = createFileRoute(
	"/delen/$organizationSlug/$moduleSlug/$eLearningSlug",
)({
	validateSearch: z.object({
		module: z.optional(z.string()),
	}),
	search: { middlewares: [retainSearchParams(["module"])] },
	loader: ({ context, params }) =>
		Promise.all([
			context.queryClient.ensureQueryData(
				sharedELearningShowThroughModuleOptions({ path: params }),
			),
			context.queryClient.prefetchQuery({ ...authMeOptions(), retry: false }),
		]),
	component: SharedELearningLayout,
});

function SharedELearningLayout() {
	const params = Route.useParams();
	const { data: user } = useQuery({ ...authMeOptions(), retry: false });
	const { data: eLearning } = useSuspenseQuery(
		sharedELearningShowThroughModuleOptions({ path: params }),
	);
	const sharedBy = eLearning.sharedBy;

	return (
		<AppLayout
			header={
				user ? (
					<AppHeader logoUrl={sharedBy?.hasLogo ? sharedBy.logoUrl : null} />
				) : (
					<SharedHeader
						organization={sharedBy}
						homeLink={overviewLink(params)}
						homeLabel={eLearning.name}
					/>
				)
			}
		/>
	);
}
