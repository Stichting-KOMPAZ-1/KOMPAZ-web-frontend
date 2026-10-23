import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import ButtonLink from "components/button/button-link";
import ChapterDetail from "components/chapter/chapter-detail";
import ContactSection from "components/contact/contact-section";
import { findChapter, stepLinks } from "components/e-learning/e-learning-utils";
import Icon from "components/icon/icon";
import PageError from "components/page/page-error";
import PageLoading from "components/page/page-loading";
import { sharedELearningShowThroughModuleOptions } from "lib/heyapi/@tanstack/react-query.gen";
import * as m from "lib/paraglide/messages";
import { sharedELearningPaths } from "lib/shared-e-learning";
import { makePageTitle } from "lib/title";

import style from "./chapters.$chapterId.module.scss";

const noProgress: ReadonlySet<string> = new Set();

export const Route = createFileRoute(
	"/delen/$organizationSlug/$moduleSlug/$eLearningSlug/chapters/$chapterId",
)({
	loader: ({ context, params }) =>
		context.queryClient.ensureQueryData(
			sharedELearningShowThroughModuleOptions({
				path: {
					organizationSlug: params.organizationSlug,
					moduleSlug: params.moduleSlug,
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
	const params = Route.useParams();
	const { data: eLearning } = useSuspenseQuery(
		sharedELearningShowThroughModuleOptions({
			path: {
				organizationSlug: params.organizationSlug,
				moduleSlug: params.moduleSlug,
				eLearningSlug: params.eLearningSlug,
			},
		}),
	);
	const paths = sharedELearningPaths(params);
	const index = eLearning.numberedChapters.findIndex(
		(candidate) => candidate.id === params.chapterId,
	);
	const chapter = findChapter(eLearning, params.chapterId);
	const { previousTo, nextTo, isLastStep } = stepLinks(
		eLearning,
		{ kind: "chapter", id: params.chapterId },
		paths,
	);

	return (
		<div className={style.page}>
			<ButtonLink {...paths.overview} variant="link" className={style.back}>
				<Icon name="arrow-left" />
				{m.elearning_back_to_overview()}
			</ButtonLink>

			{chapter ? (
				<ChapterDetail
					chapter={chapter}
					partTo={paths.part}
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

			<ContactSection contacts={eLearning.contacts} />
		</div>
	);
}
