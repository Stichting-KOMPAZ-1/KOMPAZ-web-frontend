import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, retainSearchParams } from "@tanstack/react-router";
import ButtonLink from "components/button/button-link";
import ContactSection from "components/contact/contact-section";
import { useModuleContacts } from "components/contact/use-module-contacts";
import ContentBlock from "components/content-block/content-block";
import {
	ELearningNavigationContext,
	privateELearningNavigation,
} from "components/e-learning/e-learning-navigation";
import {
	eLearningSearchSchema,
	findChapter,
	stepNavigation,
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
	const { module: moduleId } = Route.useSearch();
	const contacts = useModuleContacts(moduleId);
	const { data: part } = useSuspenseQuery(
		eLearningPartOptions({
			path: { eLearning: eLearningId, part: partId },
		}),
	);
	const { data: eLearning } = useSuspenseQuery(
		eLearningShowOptions({ path: { eLearning: eLearningId } }),
	);

	const chapter = findChapter(eLearning, part.chapterId);

	const navigation = privateELearningNavigation(eLearningId);
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

				<ContactSection contacts={contacts} />
			</div>
		</ELearningNavigationContext>
	);
}
