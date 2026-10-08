import ButtonLink from "components/button/button-link";
import { Heading } from "components/heading/heading";
import Icon from "components/icon/icon";
import type { ChapterResource } from "lib/heyapi";
import * as m from "lib/paraglide/messages";

import PartList from "./part-list";

import style from "./e-learning-summary.module.scss";

type Props = {
	chapter: ChapterResource;
	eLearningId: string;
	completedPartIds: ReadonlySet<string>;
};

const ELearningSummary = ({
	chapter,
	eLearningId,
	completedPartIds,
}: Props) => (
	<section className={style.card}>
		<span className={style.icon}>
			<Icon name="file-text" size={24} />
		</span>

		<div className={style.body}>
			<div className={style.header}>
				<Heading el="h2" size="20-24">
					{chapter.name}
				</Heading>

				<ButtonLink
					variant="secondary"
					className={style.action}
					to={`/e-learnings/${eLearningId}/chapters/${chapter.id}`}
				>
					{m.elearning_summary_view()}
					<Icon name="arrow-right" />
				</ButtonLink>
			</div>

			<PartList
				parts={chapter.parts}
				eLearningId={eLearningId}
				chapterId={chapter.id}
				completedPartIds={completedPartIds}
			/>
		</div>
	</section>
);

export default ELearningSummary;
