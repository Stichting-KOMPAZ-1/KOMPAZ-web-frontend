import {
	createFileRoute,
	redirect,
	retainSearchParams,
} from "@tanstack/react-router";
import { selectedOrganizationSearchSchema } from "components/organization/organization-utils";
import AppLayout from "layouts/app-layout/app-layout";
import { fetchSignedInUser } from "lib/session";

export const Route = createFileRoute("/_app")({
	validateSearch: selectedOrganizationSearchSchema,
	search: { middlewares: [retainSearchParams(["organizationId"])] },
	beforeLoad: async ({ context, location }) => {
		const user = await fetchSignedInUser(context.queryClient);
		if (!user) {
			throw redirect({
				to: "/login",
				search: {
					redirect: location.pathname !== "/" ? location.pathname : undefined,
				},
			});
		}
	},
	component: AppLayout,
});
