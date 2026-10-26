import { createFileRoute } from "@tanstack/react-router";
import { Heading } from "components/heading/heading";
import * as m from "lib/paraglide/messages";
import { makePageTitle } from "lib/title";

export const Route = createFileRoute("/_app/profile")({
	head: () => ({
		meta: [{ title: makePageTitle(m.profile_title()) }],
	}),
	component: ProfilePage,
});

function ProfilePage() {
	return (
		<Heading el="h1" size="16-18">
			{m.profile_title()}
		</Heading>
	);
}
