import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import Button from "components/button/button";
import Icon from "components/icon/icon";
import { authRevoke } from "lib/heyapi";
import { authMeOptions } from "lib/heyapi/@tanstack/react-query.gen";
import * as m from "lib/paraglide/messages";
import { usePermissions } from "lib/permissions";

import Header from "./header";
import NavItem from "./nav-item";

import style from "./app-header.module.scss";

const AppHeader = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: user } = useQuery(authMeOptions());
	const { canManageOrganization } = usePermissions();

	const handleLogout = async () => {
		await authRevoke().catch(() => undefined);
		queryClient.clear();
		await navigate({ to: "/login" });
	};

	return (
		// TODO: Update organization check if needed when KOM-112 is completed
		// TODO: Update aria-label when KOM-93 is completed
		<Header
			organization={user && { name: user.organizationName }}
			logoLink={{ to: "/", "aria-label": m.nav_home() }}
		>
			<nav className={style.nav} aria-label={m.nav_label()}>
				{canManageOrganization && (
					<NavItem to="/admin" icon="shield" label={m.nav_admin()} />
				)}
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
		</Header>
	);
};

export default AppHeader;
