import {
	createFileRoute,
	redirect,
	retainSearchParams,
} from "@tanstack/react-router";
import { selectedOrganizationSearchSchema } from "components/organization/organization-utils";
import AppLayout from "layouts/app-layout/app-layout";
import { fetchSignedInUser } from "lib/signed-in-user";

export const Route = createFileRoute("/_app")({
	validateSearch: selectedOrganizationSearchSchema,
	search: { middlewares: [retainSearchParams(["organizationId"])] },
	beforeLoad: async ({ context, location }) => {
		if ((await fetchSignedInUser(context.queryClient)) === null) {
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
