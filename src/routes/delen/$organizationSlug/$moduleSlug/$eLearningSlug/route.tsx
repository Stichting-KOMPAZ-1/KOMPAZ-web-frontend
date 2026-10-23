import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import SharedHeader from "components/header/shared-header";
import AppLayout from "layouts/app-layout/app-layout";
import { sharedELearningShowThroughModuleOptions } from "lib/heyapi/@tanstack/react-query.gen";

export const Route = createFileRoute(
	"/delen/$organizationSlug/$moduleSlug/$eLearningSlug",
)({
	loader: ({ context, params }) =>
		context.queryClient.ensureQueryData(
			sharedELearningShowThroughModuleOptions({ path: params }),
		),
	component: SharedELearningLayout,
});

function SharedELearningLayout() {
	const params = Route.useParams();
	const { data: eLearning } = useSuspenseQuery(
		sharedELearningShowThroughModuleOptions({ path: params }),
	);

	return (
		<AppLayout header={<SharedHeader organization={eLearning.sharedBy} />} />
	);
}
