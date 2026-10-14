import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, retainSearchParams } from "@tanstack/react-router";
import ButtonLink from "components/button/button-link";
import { eLearningSearchSchema } from "components/e-learning/e-learning";
import { Heading } from "components/heading/heading";
import Icon from "components/icon/icon";
import PageError from "components/page/page-error";
import PageLoading from "components/page/page-loading";
import { eLearningPartOptions } from "lib/heyapi/@tanstack/react-query.gen";
import * as m from "lib/paraglide/messages";
import { makePageTitle } from "lib/title";

import style from "./$eLearningId_.parts.$partId.module.scss";

export const Route = createFileRoute(
	"/_app/e-learnings/$eLearningId_/parts/$partId",
)({
	validateSearch: eLearningSearchSchema,
	search: { middlewares: [retainSearchParams(["module"])] },
	loader: ({ context, params }) =>
		context.queryClient.ensureQueryData(
			eLearningPartOptions({
				path: { eLearning: params.eLearningId, part: params.partId },
			}),
		),
	head: ({ loaderData }) => ({
		meta: [{ title: makePageTitle(loaderData?.name ?? "") }],
	}),
	errorComponent: () => <PageError>{m.elearning_part_load_error()}</PageError>,
	pendingComponent: PageLoading,
	component: PartPage,
});

function PartPage() {
	const { eLearningId, partId } = Route.useParams();
	const { data: part } = useSuspenseQuery(
		eLearningPartOptions({
			path: { eLearning: eLearningId, part: partId },
		}),
	);

	return (
		<div className={style.page}>
			<ButtonLink
				to={`/e-learnings/${eLearningId}`}
				variant="link"
				className={style.back}
			>
				<Icon name="arrow-left" />
				{m.elearning_back_to_overview()}
			</ButtonLink>

			<Heading el="h1" size="24-32">
				{part.name}
			</Heading>
		</div>
	);
}
