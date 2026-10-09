import { Heading } from "components/heading/heading";
import type { ChapterResource } from "lib/heyapi";
import * as m from "lib/paraglide/messages";

import ChapterBadge from "./chapter-badge";
import PartRow from "./part-row";
import StepNav from "./step-nav";

import style from "./chapter-detail.module.scss";

type Props = {
	chapter: ChapterResource;
	eLearningId: string;
	completedPartIds: ReadonlySet<string>;
	number?: number;
	total?: number;
	previousTo?: string;
	nextTo?: string;
	isLastStep?: boolean;
};

const ChapterDetail = ({
	chapter,
	eLearningId,
	completedPartIds,
	number,
	total,
	previousTo,
	nextTo,
	isLastStep = false,
}: Props) => {
	const isSummary = number === undefined || total === undefined;
	const hasParts = chapter.parts.length > 0;

	const nextLabel = isLastStep
		? m.elearning_finish()
		: !hasParts
			? m.elearning_chapter_next()
			: isSummary
				? m.elearning_summary_view()
				: m.elearning_chapter_start();

	return (
		<article className={style.card}>
			<div className={style.main}>
				<span className={style.badge}>
					<ChapterBadge number={number} size="large" />
				</span>

				<div className={style.body}>
					<header className={style.intro}>
						<p className={style.eyebrow}>
							{isSummary
								? m.elearning_chapter_summary()
								: m.elearning_chapter_number_of({ number, total })}
						</p>

						<Heading el="h1" size="24-32">
							{chapter.name}
						</Heading>

						{chapter.description && (
							<p className={style.description}>{chapter.description}</p>
						)}
					</header>

					<section className={style.parts}>
						<Heading el="h2" size="20-24">
							{m.elearning_chapter_parts_title({ count: chapter.parts.length })}
						</Heading>

						{hasParts ? (
							<ul className={style.list}>
								{chapter.parts.map((part) => (
									<PartRow
										key={part.id}
										part={part}
										to={`/e-learnings/${eLearningId}/parts/${part.id}`}
										done={completedPartIds.has(part.id)}
									/>
								))}
							</ul>
						) : (
							<p className={style.empty}>{m.elearning_chapter_parts_empty()}</p>
						)}
					</section>
				</div>
			</div>

			<StepNav
				previousTo={previousTo}
				nextTo={nextTo}
				nextLabel={nextLabel}
				hideNextIcon={isLastStep || (isSummary && hasParts)}
			/>
		</article>
	);
};

export default ChapterDetail;
