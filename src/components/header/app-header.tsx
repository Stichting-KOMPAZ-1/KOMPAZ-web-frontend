import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import clsx from "clsx";
import Button from "components/button/button";
import Icon from "components/icon/icon";
import OrganizationLogo from "components/organization/organization-logo";
import OrganizationPicker from "components/organization/organization-picker";
import { useOrganizationLogoUrl } from "components/organization/organization-utils";
import { useHideOnScrollDown } from "hooks/use-hide-on-scroll-down";
import { authRevoke } from "lib/heyapi";
import { authMeOptions } from "lib/heyapi/@tanstack/react-query.gen";
import * as m from "lib/paraglide/messages";
import { usePermissions } from "lib/permissions";

import NavItem from "./nav-item";

import style from "./app-header.module.scss";

export const headerHeight = 64;

type Props = {
	logoUrl?: string | null;
	organizationName?: string | null;
};

const AppHeader = ({ logoUrl, organizationName }: Props) => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: user } = useQuery(authMeOptions());
	const { canManageOrganization, canViewAnyOrganization } = usePermissions();
	const ownLogoUrl = useOrganizationLogoUrl();
	const hidden = useHideOnScrollDown(headerHeight);

	const handleLogout = async () => {
		await authRevoke().catch(() => undefined);
		queryClient.clear();
		await navigate({ to: "/login" });
	};

	return (
		<header className={clsx(style.header, hidden && style.hidden)}>
			<div className={style.bar}>
				<Link to="/" className={style.logo} aria-label={m.nav_library()}>
					<OrganizationLogo
						src={logoUrl === undefined ? ownLogoUrl : logoUrl}
					/>
				</Link>
				<nav className={style.nav} aria-label={m.nav_label()}>
					<div className={style.links}>
						<NavItem
							to="/"
							activeOptions={{ exact: true }}
							label={m.nav_library()}
						/>
						{canManageOrganization && (
							<NavItem to="/admin" icon="shield" label={m.nav_admin()} />
						)}
					</div>
					<div className={style.account}>
						<NavItem
							to="/profile"
							icon="user-cog"
							label={user?.name ?? m.nav_profile()}
							hideLabelOnMobile
						/>
						<Button
							variant="link"
							onClick={handleLogout}
							aria-label={m.nav_logout()}
						>
							<Icon name="log-out" />
						</Button>
					</div>
				</nav>
			</div>
			{canViewAnyOrganization && (
				<div className={style.context}>
					<OrganizationPicker organizationName={organizationName} />
				</div>
			)}
		</header>
	);
};

export default AppHeader;
