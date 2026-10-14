import type { LinkComponentProps } from "@tanstack/react-router";
import Icon, { type IconName } from "components/icon/icon";
import { TextAnchor, TextLink } from "components/link/text-link";

import style from "./resource-row.module.scss";

type Props = {
	icon: IconName;
	title: string;
	href?: string;
	to?: LinkComponentProps["to"];
	params?: LinkComponentProps["params"];
	search?: LinkComponentProps["search"];
	highlight?: boolean;
};

const ResourceRow = ({
	icon,
	title,
	href,
	to,
	params,
	search,
	highlight = false,
}: Props) => (
	<li className={style.row}>
		<span className={highlight ? style.iconBlockHighlight : style.iconBlock}>
			<Icon name={icon} size={24} />
		</span>
		{to ? (
			<TextLink className={style.link} to={to} params={params} search={search}>
				{title}
				<Icon name="arrow-right" />
			</TextLink>
		) : href ? (
			<TextAnchor className={style.link} href={href} newTab>
				{title}
				<Icon name="external-link" />
			</TextAnchor>
		) : (
			<span>{title}</span>
		)}
	</li>
);

export default ResourceRow;
