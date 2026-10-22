import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, retainSearchParams } from "@tanstack/react-router";
import ButtonLink from "components/button/button-link";
import { useModuleContacts } from "components/contact/use-module-contacts";
import {
	ELearningNavigationContext,
	privateELearningNavigation,
} from "components/e-learning/e-learning-navigation";
import ELearningOverview from "components/e-learning/e-learning-overview";
import { eLearningSearchSchema } from "components/e-learning/e-learning-utils";
import Icon from "components/icon/icon";
import PageError from "components/page/page-error";
import PageLoading from "components/page/page-loading";
import { eLearningShowOptions } from "lib/heyapi/@tanstack/react-query.gen";
import * as m from "lib/paraglide/messages";
import { makePageTitle } from "lib/title";

import style from "./$eLearningId.module.scss";

export const Route = createFileRoute("/_app/e-learnings/$eLearningId")({
	validateSearch: eLearningSearchSchema,
	search: { middlewares: [retainSearchParams(["module"])] },
	loader: ({ context, params }) =>
		context.queryClient.ensureQueryData(
			eLearningShowOptions({ path: { eLearning: params.eLearningId } }),
		),
	head: ({ loaderData }) => ({
		meta: [{ title: makePageTitle(loaderData?.name ?? "") }],
	}),
	errorComponent: () => <PageError>{m.elearning_load_error()}</PageError>,
	pendingComponent: PageLoading,
	component: ELearningPage,
});

function ELearningPage() {
	const { eLearningId } = Route.useParams();
	const { module: moduleId } = Route.useSearch();
	const contacts = useModuleContacts(moduleId);
	const { data: eLearning } = useSuspenseQuery(
		eLearningShowOptions({ path: { eLearning: eLearningId } }),
	);

	return (
		<ELearningNavigationContext value={privateELearningNavigation(eLearningId)}>
			<div className={style.page}>
				{moduleId ? (
					<ButtonLink
						to="/modules/$moduleId"
						params={{ moduleId }}
						variant="link"
						className={style.back}
					>
						<Icon name="arrow-left" />
						{m.elearning_back_to_module()}
					</ButtonLink>
				) : (
					<ButtonLink to="/" variant="link" className={style.back}>
						<Icon name="arrow-left" />
						{m.elearning_back_to_library()}
					</ButtonLink>
				)}

				<ELearningOverview eLearning={eLearning} contacts={contacts} />
			</div>
		</ELearningNavigationContext>
	);
}
