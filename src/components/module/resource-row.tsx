import { Link, type LinkComponentProps } from "@tanstack/react-router";
import Icon, { type IconName } from "components/icon/icon";

import style from "./resource-row.module.scss";

type Props = {
	icon: IconName;
	title: string;
	href?: string;
	to?: LinkComponentProps["to"];
	params?: LinkComponentProps["params"];
	highlight?: boolean;
};

const ResourceRow = ({
	icon,
	title,
	href,
	to,
	params,
	highlight = false,
}: Props) => (
	<li className={style.row}>
		<span className={highlight ? style.iconBlockHighlight : style.iconBlock}>
			<Icon name={icon} size={24} />
		</span>
		{to ? (
			<Link className={style.link} to={to} params={params}>
				{title}
				<Icon name="arrow-right" />
			</Link>
		) : href ? (
			<a
				className={style.link}
				href={href}
				target="_blank"
				rel="noreferrer noopener"
			>
				{title}
				<Icon name="external-link" />
			</a>
		) : (
			<span>{title}</span>
		)}
	</li>
);

export default ResourceRow;
