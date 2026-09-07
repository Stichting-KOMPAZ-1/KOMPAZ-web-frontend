import type { QueryClient } from "@tanstack/react-query";
import {
	createRouter,
	RouterProvider,
} from "@tanstack/react-router";
import {
	deLocalizeUrl,
	localizeUrl,
} from "lib/paraglide/runtime";
import { routeTree } from "../routeTree.gen";

export type RouterContext = Readonly<{
	queryClient: QueryClient;
}>;

const router = createRouter({
	routeTree,
	context: {
		// biome-ignore lint/style/noNonNullAssertion: will immediately get instantiated
		queryClient: null!,
	},
	defaultPreload: "intent",
	rewrite: {
		input: ({ url }) => deLocalizeUrl(url),
		output: ({ url }) => localizeUrl(url),
	},
});

export const AppRouter = ({
	queryClient,
}: RouterContext) => {
	return (
		<RouterProvider
			router={router}
			context={{ queryClient }}
		/>
	);
};

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
