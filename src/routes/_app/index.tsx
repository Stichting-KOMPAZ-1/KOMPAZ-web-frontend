import { createFileRoute } from "@tanstack/react-router";
import { H1 } from "components/heading/heading";
import * as m from "lib/paraglide/messages";
import { makePageTitle } from "lib/title";
import style from "./index.module.scss";

export const Route = createFileRoute("/_app/")({
	head: () => ({
		meta: [{ title: makePageTitle(m.home_title()) }],
	}),
	component: HomePage,
});

function HomePage() {
	return (
		<div className={style.page}>
			<H1 size="medium">{m.home_title()}</H1>
		</div>
	);
}
