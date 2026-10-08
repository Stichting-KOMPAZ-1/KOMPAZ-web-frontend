import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, retainSearchParams } from "@tanstack/react-router";
import ButtonLink from "components/button/button-link";
import { eLearningSearchSchema } from "components/e-learning/e-learning";
import { Heading } from "components/heading/heading";
import Icon from "components/icon/icon";
import PageError from "components/page/page-error";
import PageLoading from "components/page/page-loading";
import { eLearningShowOptions } from "lib/heyapi/@tanstack/react-query.gen";
import * as m from "lib/paraglide/messages";
import { makePageTitle } from "lib/title";

import style from "./$eLearningId_.chapters.$chapterId.module.scss";

export const Route = createFileRoute(
	"/_app/e-learnings/$eLearningId_/chapters/$chapterId",
)({
	validateSearch: eLearningSearchSchema,
	search: { middlewares: [retainSearchParams(["module"])] },
	loader: ({ context, params }) =>
		context.queryClient.ensureQueryData(
			eLearningShowOptions({ path: { eLearning: params.eLearningId } }),
		),
	head: ({ loaderData, params }) => ({
		meta: [
			{
				title: makePageTitle(
					loaderData?.chapters.find(
						(chapter) => chapter.id === params.chapterId,
					)?.name ?? "",
				),
			},
		],
	}),
	errorComponent: () => <PageError>{m.elearning_load_error()}</PageError>,
	pendingComponent: PageLoading,
	component: ChapterPage,
});

function ChapterPage() {
	const { eLearningId, chapterId } = Route.useParams();
	const { data: eLearning } = useSuspenseQuery(
		eLearningShowOptions({ path: { eLearning: eLearningId } }),
	);

	const chapter = eLearning.chapters.find(
		(candidate) => candidate.id === chapterId,
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

			{chapter ? (
				<Heading el="h1" size="24-32">
					{chapter.name}
				</Heading>
			) : (
				<PageError>{m.elearning_chapter_not_found()}</PageError>
			)}
		</div>
	);
}
