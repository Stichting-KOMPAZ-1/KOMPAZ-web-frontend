import { Link, type LinkProps } from "@tanstack/react-router";
import LogoMark from "assets/icons/logo-mark.svg?react";
import clsx from "clsx";
import { useHideOnScrollDown } from "hooks/use-hide-on-scroll-down";
import type React from "react";

import style from "./header.module.scss";

const headerHeight = 64;

export type HeaderOrganization = {
	name: string;
	logoUrl?: string;
};

type Props = {
	organization?: HeaderOrganization;
	logoLink?: LinkProps & { "aria-label": string };
	children?: React.ReactNode;
};

const HeaderLogo = ({ organization }: Pick<Props, "organization">) =>
	organization?.logoUrl ? (
		<img
			className={style.organizationLogo}
			src={organization.logoUrl}
			alt={organization.name}
		/>
	) : (
		<LogoMark aria-hidden="true" className={style.logoMark} />
	);

const Header = ({ organization, logoLink, children }: Props) => {
	const hidden = useHideOnScrollDown(headerHeight);

	return (
		<header className={clsx(style.header, hidden && style.hidden)}>
			<div className={style.bar}>
				{logoLink ? (
					<Link {...logoLink} className={style.logo}>
						<HeaderLogo organization={organization} />
					</Link>
				) : (
					<HeaderLogo organization={organization} />
				)}
				{children}
			</div>
		</header>
	);
};

export default Header;
