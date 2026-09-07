import {
	createFileRoute,
	redirect,
} from "@tanstack/react-router";
import AppLayout from "layouts/app-layout/app-layout";
import { getApiUsersCurrentOptions } from "lib/heyapi/@tanstack/react-query.gen";

export const Route = createFileRoute("/_app")({
	beforeLoad: async ({ context, location }) => {
		// TODO: replace with more flexible permission system: https://github.com/IGNE-Agency/vite-react-template/issues/43
		try {
			await context.queryClient.ensureQueryData(
				getApiUsersCurrentOptions(),
			);
		} catch {
			throw redirect({
				to: "/login",
				search: {
					redirect:
						location.pathname !== "/"
							? location.pathname
							: undefined,
				},
			});
		}
	},
	component: AppLayout,
});
