import { Heading } from "components/heading/heading";
import type { ChapterResource } from "lib/heyapi";
import * as m from "lib/paraglide/messages";

import ChapterBadge from "./chapter-badge";
import PartList from "./part-list";

import style from "./chapter-item.module.scss";

type Props = {
	chapter: ChapterResource;
	number: number;
	eLearningId: string;
	completedPartIds: ReadonlySet<string>;
	open?: boolean;
	nextPartId?: string;
};

const ChapterItem = ({
	chapter,
	number,
	eLearningId,
	completedPartIds,
	open = false,
	nextPartId,
}: Props) => (
	<li className={style.chapter}>
		<ChapterBadge number={number} />

		<div className={style.body}>
			<p className={style.eyebrow}>{m.elearning_chapter_number({ number })}</p>

			<div className={style.text}>
				<Heading el="h3" size="18-20">
					{chapter.name}
				</Heading>
				{chapter.description && (
					<p className={style.description}>{chapter.description}</p>
				)}
			</div>

			<PartList
				parts={chapter.parts}
				eLearningId={eLearningId}
				chapterId={chapter.id}
				completedPartIds={completedPartIds}
				defaultOpen={open}
				nextPartId={nextPartId}
			/>
		</div>
	</li>
);

export default ChapterItem;
