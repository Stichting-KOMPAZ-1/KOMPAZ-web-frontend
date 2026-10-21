import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import ButtonLink from "components/button/button-link";
import ContentBlock from "components/content-block/content-block";
import {
	ELearningNavigationContext,
	publicELearningNavigation,
} from "components/e-learning/e-learning-navigation";
import {
	findChapter,
	stepNavigation,
} from "components/e-learning/e-learning-utils";
import StepNav from "components/e-learning/step-nav";
import { Heading } from "components/heading/heading";
import Icon from "components/icon/icon";
import PageError from "components/page/page-error";
import PageLoading from "components/page/page-loading";
import {
	sharedELearningPartOptions,
	sharedELearningShowOptions,
} from "lib/heyapi/@tanstack/react-query.gen";
import * as m from "lib/paraglide/messages";
import { makePageTitle } from "lib/title";

import style from "./parts.$partId.module.scss";

export const Route = createFileRoute(
	"/delen/$organizationSlug/$eLearningSlug/parts/$partId",
)({
	loader: async ({ context, params }) => {
		const { organizationSlug, eLearningSlug, partId } = params;
		const [part] = await Promise.all([
			context.queryClient.ensureQueryData(
				sharedELearningPartOptions({
					path: { organizationSlug, eLearningSlug, part: partId },
				}),
			),
			context.queryClient.ensureQueryData(
				sharedELearningShowOptions({
					path: { organizationSlug, eLearningSlug },
				}),
			),
		]);

		return part;
	},
	head: ({ loaderData }) => ({
		meta: [{ title: makePageTitle(loaderData?.name ?? "") }],
	}),
	errorComponent: () => <PageError>{m.elearning_part_load_error()}</PageError>,
	pendingComponent: PageLoading,
	component: SharedPartPage,
});

function SharedPartPage() {
	const { organizationSlug, eLearningSlug, partId } = Route.useParams();
	const { data: part } = useSuspenseQuery(
		sharedELearningPartOptions({
			path: { organizationSlug, eLearningSlug, part: partId },
		}),
	);
	const { data: eLearning } = useSuspenseQuery(
		sharedELearningShowOptions({ path: { organizationSlug, eLearningSlug } }),
	);

	const chapter = findChapter(eLearning, part.chapterId);

	const navigation = publicELearningNavigation(organizationSlug, eLearningSlug);
	const { previousTo, nextTo, isLastStep } = stepNavigation(
		eLearning,
		{ kind: "part", id: partId },
		navigation,
	);

	return (
		<ELearningNavigationContext value={navigation}>
			<div className={style.page}>
				<ButtonLink
					{...navigation.chapter(part.chapterId)}
					variant="link"
					className={style.back}
				>
					<Icon name="arrow-left" />
					{chapter?.isSummary
						? m.elearning_back_to_summary()
						: m.elearning_back_to_chapter()}
				</ButtonLink>

				<div className={style.content}>
					<div className={style.blocks}>
						<Heading el="h1" size="24-32">
							{part.name}
						</Heading>

						{part.blocks.map((block) => (
							<ContentBlock key={block.id} block={block} />
						))}
					</div>

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
		</ELearningNavigationContext>
	);
}
