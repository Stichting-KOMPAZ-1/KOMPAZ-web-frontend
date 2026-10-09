import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, retainSearchParams } from "@tanstack/react-router";
import ButtonLink from "components/button/button-link";
import ELearningContents from "components/e-learning/e-learning-contents";
import ELearningStart from "components/e-learning/e-learning-start";
import ELearningSummary from "components/e-learning/e-learning-summary";
import {
	eLearningSearchSchema,
	findNextChapter,
	findNextPart,
} from "components/e-learning/e-learning-utils";
import { Heading } from "components/heading/heading";
import Icon from "components/icon/icon";
import PageError from "components/page/page-error";
import PageLoading from "components/page/page-loading";
import Pill from "components/pill/pill";
import { eLearningShowOptions } from "lib/heyapi/@tanstack/react-query.gen";
import * as m from "lib/paraglide/messages";
import { makePageTitle } from "lib/title";

import style from "./$eLearningId.module.scss";

// TODO: KOM-66 implements it further
const noProgress: ReadonlySet<string> = new Set();

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
	const { data: eLearning } = useSuspenseQuery(
		eLearningShowOptions({ path: { eLearning: eLearningId } }),
	);

	const { numberedChapters, summaryChapters } = eLearning;
	const nextChapter = findNextChapter(numberedChapters, noProgress);
	const nextPart = findNextPart(nextChapter, noProgress);

	return (
		<div className={style.page}>
			{moduleId ? (
				<ButtonLink
					to={`/modules/${moduleId}`}
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

			<article className={style.content}>
				<header className={style.hero}>
					<div className={style.intro}>
						<div className={style.titles}>
							<Pill variant="accent-strong">{m.elearning_label()}</Pill>
							<Heading el="h1" size="24-32">
								{eLearning.name}
							</Heading>
						</div>

						{nextChapter && (
							<ELearningStart
								chapter={nextChapter}
								number={numberedChapters.indexOf(nextChapter) + 1}
								eLearningId={eLearningId}
							/>
						)}
					</div>

					<div className={style.frame}>
						<img
							className={style.image}
							src={eLearning.imageUrl}
							alt={m.elearning_image_alt({ name: eLearning.name })}
						/>
					</div>
				</header>

				<div className={style.chapters}>
					<ELearningContents
						chapters={numberedChapters}
						eLearningId={eLearningId}
						completedPartIds={noProgress}
						openChapterId={nextChapter?.id}
						nextPartId={nextPart?.id}
					/>

					{summaryChapters.map((summary) => (
						<ELearningSummary
							key={summary.id}
							chapter={summary}
							eLearningId={eLearningId}
							completedPartIds={noProgress}
						/>
					))}
				</div>
			</article>
		</div>
	);
}
