import { createFileRoute, redirect } from "@tanstack/react-router";
import AppLayout from "layouts/app-layout/app-layout";
import { authMeOptions } from "lib/heyapi/@tanstack/react-query.gen";

export const Route = createFileRoute("/_app")({
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
