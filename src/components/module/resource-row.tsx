import type { LinkComponentProps } from "@tanstack/react-router";
import Icon, { type IconName } from "components/icon/icon";
import { Anchor, Link } from "components/link/link";

import style from "./resource-row.module.scss";

type Props = {
	icon: IconName;
	title: string;
	href?: string;
	to?: LinkComponentProps["to"];
	params?: LinkComponentProps["params"];
	search?: LinkComponentProps["search"];
	highlight?: boolean;
	action?: React.ReactNode;
};

const ResourceRow = ({
	icon,
	title,
	href,
	to,
	params,
	search,
	highlight = false,
	action,
}: Props) => (
	<li className={style.row}>
		<span className={highlight ? style.iconBlockHighlight : style.iconBlock}>
			<Icon name={icon} size={24} />
		</span>
		{to ? (
			<Link className={style.link} to={to} params={params} search={search}>
				{title}
				<Icon name="arrow-right" />
			</Link>
		) : href ? (
			<Anchor className={style.link} href={href} target="_blank">
				{title}
				<Icon name="external-link" />
			</Anchor>
		) : (
			<span>{title}</span>
		)}
		{action && <div className={style.action}>{action}</div>}
	</li>
);

export default ResourceRow;
