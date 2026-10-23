import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import ButtonLink from "components/button/button-link";
import ContactSection from "components/contact/contact-section";
import ContentBlock from "components/content-block/content-block";
import { findChapter, stepLinks } from "components/e-learning/e-learning-utils";
import StepNav from "components/e-learning/step-nav";
import { Heading } from "components/heading/heading";
import Icon from "components/icon/icon";
import PageError from "components/page/page-error";
import PageLoading from "components/page/page-loading";
import {
	sharedELearningPartThroughModuleOptions,
	sharedELearningShowThroughModuleOptions,
} from "lib/heyapi/@tanstack/react-query.gen";
import * as m from "lib/paraglide/messages";
import { sharedELearningPaths } from "lib/shared-e-learning";
import { makePageTitle } from "lib/title";

import style from "./parts.$partId.module.scss";

export const Route = createFileRoute(
	"/delen/$organizationSlug/$moduleSlug/$eLearningSlug/parts/$partId",
)({
	loader: async ({ context, params }) => {
		const path = {
			organizationSlug: params.organizationSlug,
			moduleSlug: params.moduleSlug,
			eLearningSlug: params.eLearningSlug,
		};
		const [part] = await Promise.all([
			context.queryClient.ensureQueryData(
				sharedELearningPartThroughModuleOptions({
					path: { ...path, part: params.partId },
				}),
			),
			context.queryClient.ensureQueryData(
				sharedELearningShowThroughModuleOptions({ path }),
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
	const params = Route.useParams();
	const path = {
		organizationSlug: params.organizationSlug,
		moduleSlug: params.moduleSlug,
		eLearningSlug: params.eLearningSlug,
	};
	const { data: part } = useSuspenseQuery(
		sharedELearningPartThroughModuleOptions({
			path: { ...path, part: params.partId },
		}),
	);
	const { data: eLearning } = useSuspenseQuery(
		sharedELearningShowThroughModuleOptions({ path }),
	);
	const paths = sharedELearningPaths(params);
	const chapter = findChapter(eLearning, part.chapterId);
	const { previousTo, nextTo, isLastStep } = stepLinks(
		eLearning,
		{ kind: "part", id: params.partId },
		paths,
	);

	return (
		<div className={style.page}>
			<ButtonLink
				to={paths.chapter(part.chapterId)}
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

			<ContactSection contacts={eLearning.contacts} />
		</div>
	);
}
