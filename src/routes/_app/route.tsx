import {
	createFileRoute,
	redirect,
	retainSearchParams,
} from "@tanstack/react-router";
import { selectedOrganizationSearchSchema } from "components/organization/organization-utils";
import AppLayout from "layouts/app-layout/app-layout";
import { authMeOptions } from "lib/heyapi/@tanstack/react-query.gen";

export const Route = createFileRoute("/_app")({
	validateSearch: selectedOrganizationSearchSchema,
	search: { middlewares: [retainSearchParams(["organizationId"])] },
	beforeLoad: async ({ context, location }) => {
		try {
			await context.queryClient.ensureQueryData(authMeOptions());
		} catch {
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
