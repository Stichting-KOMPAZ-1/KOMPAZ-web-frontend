import ButtonLink from "components/button/button-link";
import { Heading } from "components/heading/heading";
import Icon from "components/icon/icon";
import type { ChapterResource } from "lib/heyapi";
import * as m from "lib/paraglide/messages";

import style from "./e-learning-start.module.scss";

type Props = {
	chapter: ChapterResource;
	number: number;
	eLearningId: string;
	hasContacts: boolean;
};

const ELearningStart = ({
	chapter,
	number,
	eLearningId,
	hasContacts,
}: Props) => (
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

		{hasContacts && (
			<p className={style.footer}>
				<Icon name="circle-question-mark" />
				<span className={style.question}>{m.elearning_questions()}</span>
				<ButtonLink variant="link" to="." hash="contact">
					{m.elearning_contact()}
					<Icon name="chevron-right" />
				</ButtonLink>
			</p>
		)}
	</div>
);

export default ELearningStart;
