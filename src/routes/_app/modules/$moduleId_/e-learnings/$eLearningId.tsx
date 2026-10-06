import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import ButtonLink from "components/button/button-link";
import { Heading } from "components/heading/heading";
import Icon from "components/icon/icon";
import PageError from "components/page/page-error";
import PageLoading from "components/page/page-loading";
import { eLearningShowOptions } from "lib/heyapi/@tanstack/react-query.gen";
import * as m from "lib/paraglide/messages";
import { makePageTitle } from "lib/title";

import style from "./$eLearningId.module.scss";

export const Route = createFileRoute(
	"/_app/modules/$moduleId_/e-learnings/$eLearningId",
)({
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
	const { moduleId, eLearningId } = Route.useParams();
	const { data: eLearning } = useSuspenseQuery(
		eLearningShowOptions({ path: { eLearning: eLearningId } }),
	);

	return (
		<div className={style.page}>
			<ButtonLink
				to={`/modules/${moduleId}`}
				variant="link"
				className={style.back}
			>
				<Icon name="arrow-left" />
				{m.elearning_back_to_module()}
			</ButtonLink>

			<article className={style.content}>
				<header className={style.intro}>
					<Heading el="h1" size="24-32">
						{eLearning.name}
					</Heading>
				</header>
			</article>
		</div>
	);
}
