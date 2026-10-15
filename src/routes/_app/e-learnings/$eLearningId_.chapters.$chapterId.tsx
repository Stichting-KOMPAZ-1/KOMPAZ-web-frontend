import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, retainSearchParams } from "@tanstack/react-router";
import ButtonLink from "components/button/button-link";
import ContactSection from "components/contact/contact-section";
import { useModuleContacts } from "components/contact/use-module-contacts";
import ChapterDetail from "components/e-learning/chapter-detail";
import {
	eLearningSearchSchema,
	findChapter,
	stepLinks,
} from "components/e-learning/e-learning-utils";
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
					(loaderData && findChapter(loaderData, params.chapterId)?.name) ?? "",
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
	const { module: moduleId } = Route.useSearch();
	const contacts = useModuleContacts(moduleId);
	const { data: eLearning } = useSuspenseQuery(
		eLearningShowOptions({ path: { eLearning: eLearningId } }),
	);

	const index = eLearning.numberedChapters.findIndex(
		(candidate) => candidate.id === chapterId,
	);

	const chapter = findChapter(eLearning, chapterId);

	const { previousTo, nextTo, isLastStep } = stepLinks(eLearning, {
		kind: "chapter",
		id: chapterId,
	});

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
					chapterNumber={index === -1 ? undefined : index + 1}
					totalChapters={
						index === -1 ? undefined : eLearning.numberedChapters.length
					}
					previousTo={previousTo}
					nextTo={nextTo}
					isLastStep={isLastStep}
				/>
			) : (
				<PageError>{m.elearning_chapter_not_found()}</PageError>
			)}

			<ContactSection contacts={contacts} />
		</div>
	);
}
