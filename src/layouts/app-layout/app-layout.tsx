import { Outlet } from "@tanstack/react-router";
import AppHeader from "components/header/app-header";
import type React from "react";

import style from "./app-layout.module.scss";

type Props = {
	header?: React.ReactNode;
};

const AppLayout = ({ header = <AppHeader /> }: Props) => (
	<div className={style.layout}>
		{header}
		<main className={style.gridMain}>
			<Outlet />
		</main>
	</div>
);

export default AppLayout;
