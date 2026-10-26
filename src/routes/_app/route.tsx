import { createFileRoute, retainSearchParams } from "@tanstack/react-router";
import { selectedOrganizationSearchSchema } from "components/organization/organization-utils";
import AppLayout from "layouts/app-layout/app-layout";
import { ensureSignedInUser } from "lib/session";

export const Route = createFileRoute("/_app")({
	validateSearch: selectedOrganizationSearchSchema,
	search: { middlewares: [retainSearchParams(["organizationId"])] },
	beforeLoad: async ({ context, location }) => {
		await ensureSignedInUser(context.queryClient, location);
	},
	component: AppLayout,
});
