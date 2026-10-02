import { createFileRoute } from "@tanstack/react-router";
import { H1 } from "components/heading/heading";
import * as m from "lib/paraglide/messages";
import { makePageTitle } from "lib/title";

export const Route = createFileRoute("/_app/profile")({
	head: () => ({
		meta: [{ title: makePageTitle(m.profile_title()) }],
	}),
	component: ProfilePage,
});

function ProfilePage() {
	return <H1 size="medium">{m.profile_title()}</H1>;
}
