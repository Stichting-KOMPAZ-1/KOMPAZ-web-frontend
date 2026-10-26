import type { LinkProps } from "@tanstack/react-router";
import ButtonLink from "components/button/button-link";
import PartList from "components/chapter-part/part-list";
import { Heading } from "components/heading/heading";
import Icon from "components/icon/icon";
import type { ChapterResource } from "lib/heyapi";
import * as m from "lib/paraglide/messages";

import style from "./e-learning-summary.module.scss";

type Props = {
	chapter: ChapterResource;
	chapterTo: LinkProps;
	partTo: (partId: string) => LinkProps;
	completedPartIds: ReadonlySet<string>;
};

const ELearningSummary = ({
	chapter,
	chapterTo,
	partTo,
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

				<ButtonLink variant="secondary" className={style.action} {...chapterTo}>
					{m.elearning_summary_view()}
					<Icon name="arrow-right" />
				</ButtonLink>
			</div>

			<PartList
				parts={chapter.parts}
				partTo={partTo}
				completedPartIds={completedPartIds}
			/>
		</div>
	</section>
);

export default ELearningSummary;
