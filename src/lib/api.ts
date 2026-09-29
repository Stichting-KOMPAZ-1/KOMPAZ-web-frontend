import { QueryClient } from "@tanstack/react-query";
import env from "env";

import { CSRF_HEADER, ensureCsrfCookie, readCsrfToken } from "./auth";
import { client } from "./heyapi/client.gen";

client.setConfig({
	baseUrl: env.apiBaseUrl,
	credentials: "include",
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

const SAFE_METHODS = ["GET", "HEAD", "OPTIONS"];
const CSRF_MISMATCH = 419;

// oxlint-disable-next-line oxc/no-async-endpoint-handlers -- a hey-api interceptor, not an Express route
client.interceptors.request.use(async (request: Request) => {
	if (SAFE_METHODS.includes(request.method.toUpperCase())) {
		return request;
	}
	await ensureCsrfCookie();
	const token = readCsrfToken();
	if (token) request.headers.set(CSRF_HEADER, token);
	return request;
});

client.interceptors.response.use((response) => {
	if (response.status === 401 || response.status === CSRF_MISMATCH) {
		queryClient.clear();
	}
	return response;
});
