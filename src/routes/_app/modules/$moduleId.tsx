import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import ButtonLink from "components/button/button-link";
import { Heading } from "components/heading/heading";
import Icon from "components/icon/icon";
import LoadingIndicator from "components/loading-indicator/loading-indicator";
import ResourceRow from "components/module/resource-row";
import ResourceSection from "components/module/resource-section";
import Pill from "components/pill/pill";
import SystemMessage from "components/system-message/system-message";
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
	errorComponent: () => (
		<div className={style.page}>
			<SystemMessage variant="error">{m.module_load_error()}</SystemMessage>
		</div>
	),
	component: ModulePage,
});

function ModulePage() {
	const { moduleId } = Route.useParams();
	const {
		data: module,
		isPending,
		isError,
	} = useQuery(moduleShowOptions({ path: { module: moduleId } }));

	if (isPending) {
		return (
			<div className={style.page}>
				<LoadingIndicator />
			</div>
		);
	}

	if (isError) {
		return (
			<div className={style.page}>
				<SystemMessage variant="error">{m.module_load_error()}</SystemMessage>
			</div>
		);
	}

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
								to="/modules/$moduleId/e-learnings/$eLearningId"
								params={{ moduleId, eLearningId: eLearning.id }}
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
