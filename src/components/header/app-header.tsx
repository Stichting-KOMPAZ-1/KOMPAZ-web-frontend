import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import LogoMark from "assets/icons/logo-mark.svg?react";
import clsx from "clsx";
import Button from "components/button/button";
import Icon from "components/icon/icon";
import { useHideOnScrollDown } from "hooks/use-hide-on-scroll-down";
import { authRevoke } from "lib/heyapi";
import { authMeOptions } from "lib/heyapi/@tanstack/react-query.gen";
import * as m from "lib/paraglide/messages";

import NavItem from "./nav-item";

import style from "./app-header.module.scss";

const headerHeight = 64;

const AppHeader = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: user } = useQuery(authMeOptions());
	const hidden = useHideOnScrollDown(headerHeight);

	const handleLogout = async () => {
		await authRevoke().catch(() => undefined);
		queryClient.clear();
		await navigate({ to: "/login" });
	};

	return (
		<header className={clsx(style.header, hidden && style.hidden)}>
			<div className={style.bar}>
				<Link to="/" className={style.logo} aria-label={m.nav_home()}>
					<LogoMark aria-hidden="true" className={style.logoMark} />
				</Link>
				<nav className={style.nav} aria-label={m.nav_label()}>
					<NavItem to="/admin" icon="shield" label={m.nav_admin()} />
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
		</header>
	);
};

export default AppHeader;
