import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, retainSearchParams } from "@tanstack/react-router";
import ButtonLink from "components/button/button-link";
import ChapterDetail from "components/e-learning/chapter-detail";
import {
	buildSteps,
	eLearningSearchSchema,
	splitChapters,
	stepPath,
} from "components/e-learning/e-learning";
import Icon from "components/icon/icon";
import PageError from "components/page/page-error";
import PageLoading from "components/page/page-loading";
import { eLearningShowOptions } from "lib/heyapi/@tanstack/react-query.gen";
import * as m from "lib/paraglide/messages";
import { makePageTitle } from "lib/title";

import style from "./$eLearningId_.chapters.$chapterId.module.scss";

// TODO: KOM-66 implements it further
const noProgress: ReadonlySet<string> = new Set();

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

	const { numbered } = splitChapters(eLearning.chapters);
	const index = numbered.findIndex((candidate) => candidate.id === chapterId);

	const chapter = eLearning.chapters.find(
		(candidate) => candidate.id === chapterId,
	);

	const steps = buildSteps(eLearning.chapters);
	const position = steps.findIndex(
		(step) => step.kind === "chapter" && step.id === chapterId,
	);

	// TODO: KOM-66 marks the e-learning as completed on the last step
	const nextStep = steps[position + 1];

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
				<ChapterDetail
					chapter={chapter}
					eLearningId={eLearningId}
					completedPartIds={noProgress}
					number={index === -1 ? undefined : index + 1}
					total={index === -1 ? undefined : numbered.length}
					previousTo={stepPath(steps[position - 1], eLearningId)}
					nextTo={
						stepPath(nextStep, eLearningId) ?? `/e-learnings/${eLearningId}`
					}
					isLastStep={!nextStep}
				/>
			) : (
				<PageError>{m.elearning_chapter_not_found()}</PageError>
			)}
		</div>
	);
}
