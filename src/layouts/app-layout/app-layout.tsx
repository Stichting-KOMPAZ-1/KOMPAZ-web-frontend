import { Outlet } from "@tanstack/react-router";
import AppHeader from "components/header/app-header";
import style from "./app-layout.module.scss";

const AppLayout = () => (
	<div className={style.layout}>
		<AppHeader />
		<main className={style.gridMain}>
			<Outlet />
		</main>
	</div>
);

export default AppLayout;
