import { Link } from "@tanstack/react-router";
import Icon from "components/icon/icon";
import type { PartSummaryResource } from "lib/heyapi";

import PartStatus from "./part-status";

import style from "./part-row.module.scss";

type Props = {
	part: PartSummaryResource;
	to: string;
	done: boolean;
	callToAction?: string;
};

const PartRow = ({ part, to, done, callToAction }: Props) => (
	<li className={style.row}>
		<PartStatus done={done} />
		<Link className={style.link} to={to}>
			<span className={style.name}>{part.name}</span>
			{callToAction && (
				<span className={style.callToAction}>{callToAction}</span>
			)}
			<Icon name="chevron-right" />
		</Link>
	</li>
);

export default PartRow;
