import { Link } from "@tanstack/react-router";
import type { ELearningNavigationLink } from "components/e-learning/e-learning-navigation";
import Icon from "components/icon/icon";
import type { PartSummaryResource } from "lib/heyapi";

import PartStatus from "./part-status";

import style from "./part-row.module.scss";

type Props = {
	part: PartSummaryResource;
	link: ELearningNavigationLink;
	done: boolean;
	callToAction?: string;
};

const PartRow = ({ part, link, done, callToAction }: Props) => (
	<li className={style.row}>
		<PartStatus done={done} />
		<Link {...link} className={style.link}>
			<span className={style.name}>{part.name}</span>
			{callToAction && (
				<span className={style.callToAction}>{callToAction}</span>
			)}
			<Icon name="chevron-right" />
		</Link>
	</li>
);

export default PartRow;
