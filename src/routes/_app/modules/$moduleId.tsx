import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import ButtonLink from "components/button/button-link";
import { Heading } from "components/heading/heading";
import Icon from "components/icon/icon";
import ResourceRow from "components/module/resource-row";
import ResourceSection from "components/module/resource-section";
import PageError from "components/page/page-error";
import PageLoading from "components/page/page-loading";
import Pill from "components/pill/pill";
import { moduleShowOptions } from "lib/heyapi/@tanstack/react-query.gen";
import * as m from "lib/paraglide/messages";
import { makePageTitle } from "lib/title";

import style from "./$moduleId.module.scss";

export const Route = createFileRoute("/_app/modules/$moduleId")({
	loader: ({ context, params }) =>
		context.queryClient.ensureQueryData(
			moduleShowOptions({ path: { module: params.moduleId } }),
		),
	head: ({ loaderData }) => ({
		meta: [{ title: makePageTitle(loaderData?.name ?? "") }],
	}),
	errorComponent: () => <PageError>{m.module_load_error()}</PageError>,
	pendingComponent: PageLoading,
	component: ModulePage,
});

function ModulePage() {
	const { moduleId } = Route.useParams();
	const { data: module } = useSuspenseQuery(
		moduleShowOptions({ path: { module: moduleId } }),
	);

	return (
		<div className={style.page}>
			<ButtonLink to="/" variant="link" className={style.back}>
				<Icon name="arrow-left" />
				{m.module_back_to_library()}
			</ButtonLink>

			<article className={style.content}>
				<header className={style.intro}>
					<Pill variant="accent-strong">{module.category}</Pill>
					<Heading el="h1" size="24-32">
						{module.name}
					</Heading>
					<p className={style.description}>{module.description}</p>
				</header>

				<div className={style.sections}>
					<ResourceSection
						title={m.module_elearnings_title()}
						items={module.eLearnings}
					>
						{(eLearning) => (
							<ResourceRow
								key={eLearning.id}
								icon="graduation-cap"
								title={eLearning.name}
								to="/e-learnings/$eLearningId"
								params={{ eLearningId: eLearning.id }}
								search={{ module: moduleId }}
								highlight
							/>
						)}
					</ResourceSection>

					<ResourceSection
						title={m.module_videos_title()}
						items={module.videos}
					>
						{(video) => (
							<ResourceRow
								key={video.id}
								icon="video"
								title={video.title}
								href={video.url ?? video.fileUrl ?? undefined}
							/>
						)}
					</ResourceSection>

					<ResourceSection title={m.module_links_title()} items={module.links}>
						{(link) => (
							<ResourceRow
								key={link.id}
								icon="link"
								title={link.title}
								href={link.url}
							/>
						)}
					</ResourceSection>

					{module.sourceAttribution && (
						<p className={style.attribution}>{module.sourceAttribution}</p>
					)}
				</div>
			</article>
		</div>
	);
}
