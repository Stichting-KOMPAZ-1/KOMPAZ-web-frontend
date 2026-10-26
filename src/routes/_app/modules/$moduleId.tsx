import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import ButtonLink from "components/button/button-link";
import ContactSection from "components/contact/contact-section";
import { Heading } from "components/heading/heading";
import Icon from "components/icon/icon";
import CopyLinkButton from "components/module/copy-link-button";
import ResourceRow from "components/module/resource-row";
import ResourceSection from "components/module/resource-section";
import ShareELearningModal from "components/module/share-e-learning-modal";
import {
	readingOrganizationFor,
	useSelectedOrganizationId,
	useReadingOrganizationId,
} from "components/organization/organization-utils";
import PageError from "components/page/page-error";
import PageLoading from "components/page/page-loading";
import Pill from "components/pill/pill";
import { problemDetail } from "lib/api/error-helpers";
import { moduleShowOptions } from "lib/heyapi/@tanstack/react-query.gen";
import * as m from "lib/paraglide/messages";
import { ensureSignedInUser } from "lib/session";
import { makePageTitle } from "lib/title";

import style from "./$moduleId.module.scss";

export const Route = createFileRoute("/_app/modules/$moduleId")({
	staticData: { organizationFixed: true },
	loaderDeps: ({ search }) => ({ organizationId: search.organizationId }),
	loader: async ({ context, params, deps, location }) => {
		const path = { module: params.moduleId };
		const user = await ensureSignedInUser(context.queryClient, location);
		const organizationId = readingOrganizationFor(user, deps.organizationId);

		return context.queryClient.ensureQueryData(
			moduleShowOptions({ path, query: { organizationId } }),
		);
	},
	head: ({ loaderData }) => ({
		meta: [{ title: makePageTitle(loaderData?.name ?? "") }],
	}),
	errorComponent: ({ error }) => (
		<PageError>{problemDetail(error) ?? m.module_load_error()}</PageError>
	),
	pendingComponent: PageLoading,
	component: ModulePage,
});

function ModulePage() {
	const { moduleId } = Route.useParams();
	const selectedOrganizationId = useSelectedOrganizationId();
	const { data: module } = useSuspenseQuery(
		moduleShowOptions({
			path: { module: moduleId },
			query: { organizationId: useReadingOrganizationId() },
		}),
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
						{(eLearning) => {
							const slugs = eLearning.shareSlugs;
							const params = slugs
								? {
										organizationSlug: slugs.organization,
										moduleSlug: slugs.module,
										eLearningSlug: slugs.eLearning,
									}
								: undefined;

							return (
								<ResourceRow
									key={eLearning.id}
									icon="graduation-cap"
									title={eLearning.name}
									to={
										params &&
										"/delen/$organizationSlug/$moduleSlug/$eLearningSlug"
									}
									params={params}
									search={{ organizationId: selectedOrganizationId }}
									highlight
									action={<ShareELearningModal eLearning={eLearning} />}
								/>
							);
						}}
					</ResourceSection>

					<ResourceSection
						title={m.module_videos_title()}
						items={module.videos}
					>
						{(video) => {
							const url = video.url ?? video.fileUrl ?? undefined;

							return (
								<ResourceRow
									key={video.id}
									icon="video"
									title={video.title}
									href={url}
									action={
										<CopyLinkButton
											url={url}
											label={m.module_copy_video_link()}
											copiedLabel={m.module_video_link_copied()}
										/>
									}
								/>
							);
						}}
					</ResourceSection>

					<ResourceSection title={m.module_links_title()} items={module.links}>
						{(link) => (
							<ResourceRow
								key={link.id}
								icon="link"
								title={link.title}
								href={link.url}
								action={
									<CopyLinkButton
										url={link.url}
										label={m.module_copy_link()}
										copiedLabel={m.module_link_copied()}
									/>
								}
							/>
						)}
					</ResourceSection>

					{module.sourceAttribution && (
						<p className={style.attribution}>{module.sourceAttribution}</p>
					)}
				</div>
			</article>

			<ContactSection contacts={module.contacts} />
		</div>
	);
}
