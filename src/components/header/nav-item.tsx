import { Link, type LinkComponentProps } from "@tanstack/react-router";
import clsx from "clsx";
import Icon, { type IconName } from "components/icon/icon";

import style from "./nav-item.module.scss";

type Props = Pick<LinkComponentProps, "to" | "activeOptions"> & {
	icon?: IconName;
	label: string;
	hideLabelOnMobile?: boolean;
};

const NavItem = ({
	to,
	activeOptions,
	icon,
	label,
	hideLabelOnMobile = false,
}: Props) => (
	<Link
		to={to}
		activeOptions={activeOptions}
		className={style.item}
		aria-label={label}
	>
		{icon && <Icon name={icon} />}
		<span className={clsx(style.label, hideLabelOnMobile && style.desktopOnly)}>
			{label}
		</span>
	</Link>
);

export default NavItem;
