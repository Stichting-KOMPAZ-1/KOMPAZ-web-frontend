import { Outlet } from "@tanstack/react-router";

import style from "./auth-layout.module.scss";

const AuthLayout = () => (
	<div className={style.layout}>
		<main className={style.page}>
			<Outlet />
		</main>
	</div>
);

export default AuthLayout;
