import ContactSection from "components/contact/contact-section";
import { Heading } from "components/heading/heading";
import Pill from "components/pill/pill";
import type { ELearningResource, ModuleContactResource } from "lib/heyapi";
import * as m from "lib/paraglide/messages";

import ELearningContents from "./e-learning-contents";
import ELearningStart from "./e-learning-start";
import ELearningSummary from "./e-learning-summary";
import { findNextChapter, findNextPart } from "./e-learning-utils";

import style from "./e-learning-overview.module.scss";

// TODO: KOM-66 implements it further
const noProgress: ReadonlySet<string> = new Set();

type Props = {
	eLearning: ELearningResource;
	contacts: readonly ModuleContactResource[];
};

const ELearningOverview = ({ eLearning, contacts }: Props) => {
	const { numberedChapters, summaryChapters } = eLearning;
	const nextChapter = findNextChapter(numberedChapters, noProgress);
	const nextPart = findNextPart(nextChapter, noProgress);

	return (
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
							number={numberedChapters.indexOf(nextChapter) + 1}
							hasContacts={contacts.length > 0}
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
					chapters={numberedChapters}
					completedPartIds={noProgress}
					openChapterId={nextChapter?.id}
					nextPartId={nextPart?.id}
				/>

				{summaryChapters.map((summary) => (
					<ELearningSummary
						key={summary.id}
						chapter={summary}
						completedPartIds={noProgress}
					/>
				))}
			</div>

			<ContactSection contacts={contacts} />
		</article>
	);
};

export default ELearningOverview;
