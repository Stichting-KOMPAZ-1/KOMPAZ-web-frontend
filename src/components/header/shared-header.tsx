import { Link, type LinkProps } from "@tanstack/react-router";
import clsx from "clsx";
import OrganizationLogo from "components/organization/organization-logo";
import { useHideOnScrollDown } from "hooks/use-hide-on-scroll-down";
import type { SharedOrganizationResource } from "lib/heyapi";

import { headerHeight } from "./app-header";

import style from "./app-header.module.scss";

type Props = {
	organization: SharedOrganizationResource | null;
	homeLink: LinkProps;
	homeLabel: string;
};

const SharedHeader = ({ organization, homeLink, homeLabel }: Props) => {
	const hidden = useHideOnScrollDown(headerHeight);

	return (
		<header className={clsx(style.header, hidden && style.hidden)}>
			<div className={style.bar}>
				<Link {...homeLink} className={style.logo} aria-label={homeLabel}>
					<OrganizationLogo
						src={organization?.hasLogo ? organization.logoUrl : null}
					/>
				</Link>
			</div>
		</header>
	);
};

export default SharedHeader;
