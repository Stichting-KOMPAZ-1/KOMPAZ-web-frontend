import { QueryClient } from "@tanstack/react-query";
import env from "env";
import { endSession, getAccessToken } from "./auth";
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

client.interceptors.request.use((request) => {
	const accessToken = getAccessToken();
	if (accessToken) {
		request.headers.set(
			"Authorization",
			`Bearer ${accessToken}`,
		);
	}
	return request;
});

client.interceptors.response.use((response) => {
	// The API considers the session gone, so drop it here too rather than
	// leaving cached data sitting behind a dead token.
	if (response.status === 401) {
		endSession();
		queryClient.clear();
	}
	return response;
});
