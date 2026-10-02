import { Link, type LinkComponentProps } from "@tanstack/react-router";
import clsx from "clsx";
import Icon, { type IconName } from "components/icon/icon";

import style from "./nav-item.module.scss";

type Props = Pick<LinkComponentProps, "to"> & {
	icon: IconName;
	label: string;
	hideLabelOnMobile?: boolean;
};

const NavItem = ({ to, icon, label, hideLabelOnMobile = false }: Props) => (
	<Link to={to} className={style.item} aria-label={label}>
		<Icon name={icon} />
		<span className={clsx(style.label, hideLabelOnMobile && style.desktopOnly)}>
			{label}
		</span>
	</Link>
);

export default NavItem;
