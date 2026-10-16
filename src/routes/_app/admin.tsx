import { createFileRoute } from "@tanstack/react-router";
import { H1 } from "components/heading/heading";
import * as m from "lib/paraglide/messages";
import { makePageTitle } from "lib/title";

export const Route = createFileRoute("/_app/admin")({
	head: () => ({
		meta: [{ title: makePageTitle(m.admin_title()) }],
	}),
	component: AdminPage,
});

function AdminPage() {
	return <H1 size="16-18">{m.admin_title()}</H1>;
}
