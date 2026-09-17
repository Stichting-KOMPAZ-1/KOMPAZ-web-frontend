import { QueryClient } from "@tanstack/react-query";
import env from "env";
import { client } from "./heyapi/client.gen";

client.setConfig({
	baseUrl: env.VITE_API_BASEURL,
	headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
	},
});

const FIVE_MINUTES = 5 * 60 * 1000;

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 0,
			gcTime: FIVE_MINUTES,
		},
	},
});
