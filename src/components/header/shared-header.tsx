import LogoMark from "assets/icons/logo-mark.svg?react";
import clsx from "clsx";
import { useHideOnScrollDown } from "hooks/use-hide-on-scroll-down";
import type { SharedOrganizationResource } from "lib/heyapi";

import style from "./shared-header.module.scss";

const headerHeight = 64;

type Props = {
	organization: SharedOrganizationResource | null;
};

const SharedHeader = ({ organization }: Props) => {
	const hidden = useHideOnScrollDown(headerHeight);

	return (
		<header className={clsx(style.header, hidden && style.hidden)}>
			<div className={style.bar}>
				{organization?.hasLogo ? (
					<img
						className={style.organizationLogo}
						src={organization.logoUrl}
						alt={organization.name}
					/>
				) : (
					<LogoMark aria-hidden="true" className={style.logoMark} />
				)}
				{organization && (
					<span className={style.name}>{organization.name}</span>
				)}
			</div>
		</header>
	);
};

export default SharedHeader;
