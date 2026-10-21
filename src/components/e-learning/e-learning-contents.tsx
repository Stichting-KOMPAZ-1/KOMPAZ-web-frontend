import ChapterItem from "components/chapter/chapter-item";
import { Heading } from "components/heading/heading";
import type { ChapterResource } from "lib/heyapi";
import * as m from "lib/paraglide/messages";

import style from "./e-learning-contents.module.scss";

type Props = {
	chapters: readonly ChapterResource[];
	completedPartIds: ReadonlySet<string>;
	openChapterId?: string;
	nextPartId?: string;
};

const ELearningContents = ({
	chapters,
	completedPartIds,
	openChapterId,
	nextPartId,
}: Props) => (
	<section className={style.card}>
		<header className={style.header}>
			<Heading el="h2" size="20-24">
				{m.elearning_contents_title()}
			</Heading>
			<p className={style.count}>
				{m.elearning_chapter_count({ count: chapters.length })}
			</p>
		</header>

		{chapters.length === 0 ? (
			<p className={style.empty}>{m.elearning_chapters_empty()}</p>
		) : (
			<ol className={style.list}>
				{chapters.map((chapter, index) => (
					<ChapterItem
						key={chapter.id}
						chapter={chapter}
						number={index + 1}
						completedPartIds={completedPartIds}
						open={chapter.id === openChapterId}
						nextPartId={nextPartId}
					/>
				))}
			</ol>
		)}
	</section>
);

export default ELearningContents;
