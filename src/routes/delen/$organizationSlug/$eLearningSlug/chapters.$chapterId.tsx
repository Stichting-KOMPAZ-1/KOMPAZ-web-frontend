import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import ButtonLink from "components/button/button-link";
import ChapterDetail from "components/chapter/chapter-detail";
import {
	ELearningNavigationContext,
	publicELearningNavigation,
} from "components/e-learning/e-learning-navigation";
import {
	findChapter,
	stepNavigation,
} from "components/e-learning/e-learning-utils";
import Icon from "components/icon/icon";
import PageError from "components/page/page-error";
import PageLoading from "components/page/page-loading";
import { sharedELearningShowOptions } from "lib/heyapi/@tanstack/react-query.gen";
import * as m from "lib/paraglide/messages";
import { makePageTitle } from "lib/title";

import style from "./chapters.$chapterId.module.scss";

// TODO: KOM-66 implements it further
const noProgress: ReadonlySet<string> = new Set();

export const Route = createFileRoute(
	"/delen/$organizationSlug/$eLearningSlug/chapters/$chapterId",
)({
	loader: ({ context, params }) =>
		context.queryClient.ensureQueryData(
			sharedELearningShowOptions({
				path: {
					organizationSlug: params.organizationSlug,
					eLearningSlug: params.eLearningSlug,
				},
			}),
		),
	head: ({ loaderData, params }) => ({
		meta: [
			{
				title: makePageTitle(
					(loaderData && findChapter(loaderData, params.chapterId)?.name) ?? "",
				),
			},
		],
	}),
	errorComponent: () => <PageError>{m.elearning_load_error()}</PageError>,
	pendingComponent: PageLoading,
	component: SharedChapterPage,
});

function SharedChapterPage() {
	const { organizationSlug, eLearningSlug, chapterId } = Route.useParams();
	const { data: eLearning } = useSuspenseQuery(
		sharedELearningShowOptions({ path: { organizationSlug, eLearningSlug } }),
	);

	const index = eLearning.numberedChapters.findIndex(
		(candidate) => candidate.id === chapterId,
	);

	const chapter = findChapter(eLearning, chapterId);

	const navigation = publicELearningNavigation(organizationSlug, eLearningSlug);
	const { previousTo, nextTo, isLastStep } = stepNavigation(
		eLearning,
		{ kind: "chapter", id: chapterId },
		navigation,
	);

	return (
		<ELearningNavigationContext value={navigation}>
			<div className={style.page}>
				<ButtonLink
					{...navigation.overview}
					variant="link"
					className={style.back}
				>
					<Icon name="arrow-left" />
					{m.elearning_back_to_overview()}
				</ButtonLink>

				{chapter ? (
					<ChapterDetail
						chapter={chapter}
						completedPartIds={noProgress}
						chapterNumber={index === -1 ? undefined : index + 1}
						totalChapters={
							index === -1 ? undefined : eLearning.numberedChapters.length
						}
						previousTo={previousTo}
						nextTo={nextTo}
						isLastStep={isLastStep}
						className={style.detail}
					/>
				) : (
					<PageError>{m.elearning_chapter_not_found()}</PageError>
				)}
			</div>
		</ELearningNavigationContext>
	);
}
