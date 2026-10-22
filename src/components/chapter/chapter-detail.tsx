import clsx from "clsx";
import PartRow from "components/chapter-part/part-row";
import {
	type ELearningNavigationLink,
	useELearningNavigation,
} from "components/e-learning/e-learning-navigation";
import StepNav from "components/e-learning/step-nav";
import { Heading } from "components/heading/heading";
import type { ChapterResource } from "lib/heyapi";
import * as m from "lib/paraglide/messages";

import ChapterBadge from "./chapter-badge";

import style from "./chapter-detail.module.scss";

type Props = {
	chapter: ChapterResource;
	completedPartIds: ReadonlySet<string>;
	chapterNumber?: number;
	totalChapters?: number;
	previousTo?: ELearningNavigationLink;
	nextTo?: ELearningNavigationLink;
	isLastStep?: boolean;
	className?: string;
};

const ChapterDetail = ({
	chapter,
	completedPartIds,
	chapterNumber,
	totalChapters,
	previousTo,
	nextTo,
	isLastStep = false,
	className,
}: Props) => {
	const navigation = useELearningNavigation();
	const isSummary = chapterNumber === undefined || totalChapters === undefined;
	const hasParts = chapter.parts.length > 0;

	const nextLabel = isLastStep
		? m.elearning_finish()
		: !hasParts
			? m.elearning_chapter_next()
			: isSummary
				? m.elearning_summary_view()
				: m.elearning_chapter_start();

	return (
		<article className={clsx(style.card, className)}>
			<div className={style.main}>
				<span className={style.badge}>
					<ChapterBadge number={chapterNumber} size="large" />
				</span>

				<div className={style.body}>
					<header className={style.intro}>
						<p className={style.eyebrow}>
							{isSummary
								? m.elearning_chapter_summary()
								: m.elearning_chapter_number_of({
										number: chapterNumber,
										total: totalChapters,
									})}
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
										link={navigation.part(part.id)}
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
