import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import ButtonLink from "components/button/button-link";
import { Heading } from "components/heading/heading";
import Icon from "components/icon/icon";
import LoadingIndicator from "components/loading-indicator/loading-indicator";
import SystemMessage from "components/system-message/system-message";
import { eLearningShowOptions } from "lib/heyapi/@tanstack/react-query.gen";
import * as m from "lib/paraglide/messages";
import { makePageTitle } from "lib/title";

import style from "./$eLearningId.module.scss";

export const Route = createFileRoute(
	"/_app/modules/$moduleId_/e-learnings/$eLearningId",
)({
	loader: ({ context, params }) =>
		context.queryClient.ensureQueryData(
			eLearningShowOptions({ path: { eLearning: params.eLearningId } }),
		),
	head: ({ loaderData }) => ({
		meta: [{ title: makePageTitle(loaderData?.name ?? "") }],
	}),
	errorComponent: () => (
		<div className={style.page}>
			<SystemMessage variant="error">{m.elearning_load_error()}</SystemMessage>
		</div>
	),
	component: ELearningPage,
});

function ELearningPage() {
	const { moduleId, eLearningId } = Route.useParams();
	const {
		data: eLearning,
		isPending,
		isError,
	} = useQuery(eLearningShowOptions({ path: { eLearning: eLearningId } }));

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
				<SystemMessage variant="error">
					{m.elearning_load_error()}
				</SystemMessage>
			</div>
		);
	}

	return (
		<div className={style.page}>
			<ButtonLink
				to={`/modules/${moduleId}`}
				variant="link"
				className={style.back}
			>
				<Icon name="arrow-left" />
				{m.elearning_back_to_module()}
			</ButtonLink>

			<article className={style.content}>
				<header className={style.intro}>
					<Heading el="h1" size="24-32">
						{eLearning.name}
					</Heading>
				</header>
			</article>
		</div>
	);
}
