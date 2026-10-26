import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import ButtonLink from "components/button/button-link";
import ContactSection from "components/contact/contact-section";
import ELearningContents from "components/e-learning/e-learning-contents";
import ELearningStart from "components/e-learning/e-learning-start";
import ELearningSummary from "components/e-learning/e-learning-summary";
import {
	chapterLink,
	findNextChapter,
	findNextPart,
	partLink,
} from "components/e-learning/e-learning-utils";
import { Heading } from "components/heading/heading";
import Icon from "components/icon/icon";
import PageError from "components/page/page-error";
import PageLoading from "components/page/page-loading";
import Pill from "components/pill/pill";
import { track } from "lib/analytics";
import {
	authMeOptions,
	sharedELearningShowThroughModuleOptions,
} from "lib/heyapi/@tanstack/react-query.gen";
import * as m from "lib/paraglide/messages";
import { makePageTitle } from "lib/title";
import z from "zod";

import style from "./index.module.scss";

// TODO: KOM-66 implements it further
const noProgress: ReadonlySet<string> = new Set();

export const Route = createFileRoute(
	"/delen/$organizationSlug/$moduleSlug/$eLearningSlug/",
)({
	validateSearch: z.object({ utm_source: z.optional(z.string()) }),
	loaderDeps: ({ search }) => ({ source: search.utm_source }),
	staleTime: Infinity,
	loader: async ({ context, params, deps, preload }) => {
		const eLearning = await context.queryClient.ensureQueryData(
			sharedELearningShowThroughModuleOptions({ path: params }),
		);

		if (!preload) {
			track("elearning_open", {
				organization: params.organizationSlug,
				elearning: params.eLearningSlug,
				source: deps.source === "qr" ? "qr" : "link",
			});
		}

		return eLearning;
	},
	head: ({ loaderData }) => ({
		meta: [{ title: makePageTitle(loaderData?.name ?? "") }],
	}),
	errorComponent: () => (
		<PageError>{m.shared_elearning_unavailable()}</PageError>
	),
	pendingComponent: PageLoading,
	component: SharedELearningPage,
});

function SharedELearningPage() {
	const params = Route.useParams();
	const { data: user } = useQuery({ ...authMeOptions(), retry: false });
	const { module: moduleId, organizationId } = Route.useSearch();
	const { data: eLearning } = useSuspenseQuery(
		sharedELearningShowThroughModuleOptions({ path: params }),
	);
	const nextChapter = findNextChapter(eLearning.numberedChapters, noProgress);
	const nextPart = findNextPart(nextChapter, noProgress);

	return (
		<div className={style.page}>
			{user &&
				(moduleId ? (
					<ButtonLink
						to="/modules/$moduleId"
						params={{ moduleId }}
						search={{ organizationId }}
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
				))}

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
								number={eLearning.numberedChapters.indexOf(nextChapter) + 1}
								chapterTo={chapterLink(params, nextChapter.id)}
								hasContacts={eLearning.contacts.length > 0}
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
						chapters={eLearning.numberedChapters}
						partTo={(partId) => partLink(params, partId)}
						completedPartIds={noProgress}
						openChapterId={nextChapter?.id}
						nextPartId={nextPart?.id}
					/>

					{eLearning.summaryChapters.map((summary) => (
						<ELearningSummary
							key={summary.id}
							chapter={summary}
							chapterTo={chapterLink(params, summary.id)}
							partTo={(partId) => partLink(params, partId)}
							completedPartIds={noProgress}
						/>
					))}
				</div>
			</article>

			<ContactSection contacts={eLearning.contacts} />
		</div>
	);
}
