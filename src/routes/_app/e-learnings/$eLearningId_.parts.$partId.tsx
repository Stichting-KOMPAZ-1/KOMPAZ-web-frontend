import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, retainSearchParams } from "@tanstack/react-router";
import ButtonLink from "components/button/button-link";
import {
	eLearningSearchSchema,
	findChapter,
	stepLinks,
} from "components/e-learning/e-learning-utils";
import StepNav from "components/e-learning/step-nav";
import { Heading } from "components/heading/heading";
import Icon from "components/icon/icon";
import PageError from "components/page/page-error";
import PageLoading from "components/page/page-loading";
import {
	eLearningPartOptions,
	eLearningShowOptions,
} from "lib/heyapi/@tanstack/react-query.gen";
import * as m from "lib/paraglide/messages";
import { makePageTitle } from "lib/title";

import style from "./$eLearningId_.parts.$partId.module.scss";

export const Route = createFileRoute(
	"/_app/e-learnings/$eLearningId_/parts/$partId",
)({
	validateSearch: eLearningSearchSchema,
	search: { middlewares: [retainSearchParams(["module"])] },
	loader: async ({ context, params }) => {
		const [part] = await Promise.all([
			context.queryClient.ensureQueryData(
				eLearningPartOptions({
					path: { eLearning: params.eLearningId, part: params.partId },
				}),
			),
			context.queryClient.ensureQueryData(
				eLearningShowOptions({ path: { eLearning: params.eLearningId } }),
			),
		]);

		return part;
	},
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
	const { data: eLearning } = useSuspenseQuery(
		eLearningShowOptions({ path: { eLearning: eLearningId } }),
	);

	const chapter = findChapter(eLearning, part.chapterId);

	const { previousTo, nextTo, isLastStep } = stepLinks(eLearning, {
		kind: "part",
		id: partId,
	});

	return (
		<div className={style.page}>
			<ButtonLink
				to={`/e-learnings/${eLearningId}/chapters/${part.chapterId}`}
				variant="link"
				className={style.back}
			>
				<Icon name="arrow-left" />
				{chapter?.isSummary
					? m.elearning_back_to_summary()
					: m.elearning_back_to_chapter()}
			</ButtonLink>

			<div className={style.content}>
				<Heading el="h1" size="24-32">
					{part.name}
				</Heading>

				<StepNav
					previousTo={previousTo}
					nextTo={nextTo}
					nextLabel={
						isLastStep ? m.elearning_finish() : m.elearning_chapter_next()
					}
					hideNextIcon={isLastStep}
				/>
			</div>
		</div>
	);
}
