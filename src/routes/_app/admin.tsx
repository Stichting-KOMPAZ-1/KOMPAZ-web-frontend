import { createFileRoute, redirect } from "@tanstack/react-router";
import { Heading } from "components/heading/heading";
import { authMeOptions } from "lib/heyapi/@tanstack/react-query.gen";
import * as m from "lib/paraglide/messages";
import { canManageOrganization } from "lib/permissions";
import { makePageTitle } from "lib/title";

export const Route = createFileRoute("/_app/admin")({
	beforeLoad: async ({ context }) => {
		const user = await context.queryClient.ensureQueryData(authMeOptions());
		if (!canManageOrganization(user)) throw redirect({ to: "/" });
	},
	head: () => ({
		meta: [{ title: makePageTitle(m.admin_title()) }],
	}),
	component: AdminPage,
});

function AdminPage() {
	return (
		<Heading el="h1" size="16-18">
			{m.admin_title()}
		</Heading>
	);
}
