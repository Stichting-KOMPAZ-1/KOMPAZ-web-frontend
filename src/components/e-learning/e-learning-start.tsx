import Button from "components/button/button";
import ButtonLink from "components/button/button-link";
import { Heading } from "components/heading/heading";
import Icon from "components/icon/icon";
import type { ChapterResource } from "lib/heyapi";
import * as m from "lib/paraglide/messages";

import style from "./e-learning-start.module.scss";

// oxlint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label -- base-ui merges the button's children into this anchor
const contactLink = <a href="#contact" />;

type Props = {
	chapter: ChapterResource;
	number: number;
	eLearningId: string;
};

const ELearningStart = ({ chapter, number, eLearningId }: Props) => (
	<div className={style.card}>
		<div className={style.text}>
			<p className={style.eyebrow}>{m.elearning_chapter_number({ number })}</p>
			<Heading size="18-20">{chapter.name}</Heading>
		</div>

		<ButtonLink
			size="large"
			className={style.action}
			to={`/e-learnings/${eLearningId}/chapters/${chapter.id}`}
		>
			{m.elearning_start()}
			<Icon name="arrow-right" />
		</ButtonLink>

		<p className={style.footer}>
			<Icon name="circle-question-mark" />
			<span className={style.question}>{m.elearning_questions()}</span>
			{/* TODO: KOM-61 link it to the page footer with the contact information */}
			<Button variant="link" nativeButton={false} render={contactLink}>
				{m.elearning_contact()}
				<Icon name="chevron-right" />
			</Button>
		</p>
	</div>
);

export default ELearningStart;
