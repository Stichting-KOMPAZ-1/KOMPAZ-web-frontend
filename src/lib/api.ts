import { QueryClient } from "@tanstack/react-query";
import env from "env";
import { client } from "./heyapi/client.gen";

// While these defaults are defined to work with
// most of our projects, you might want to edit
// these based on your specific needs.

client.setConfig({
	baseUrl: env.apiBaseUrl,
	headers: {
		Accept: "application/json",
		ContentType: "application/json",
	},
});

// TODO: THIS IS FAKE API HANDLING TO MAKE THE TEMPLATE
// WORK, PLEASE REMOVE THIS AND SET YOUR PROXY TO YOUR
// ACTUAL BACKEND.
client.interceptors.response.use(async (res) => {
	// FAKE LOGIN
	if (res.url.endsWith("/api/auth/login")) {
		await cookieStore.set({
			name: "FAKE_AUTH",
			value: "yep",
		});
		return new Response("", {
			status: 200,
			statusText: "OK",
		});
	}
	// FAKE LOGUT
	if (res.url.endsWith("/api/auth/logout")) {
		await cookieStore.delete("FAKE_AUTH");
		return new Response("", {
			status: 200,
			statusText: "OK",
		});
	}
	// FAKE USER
	if (res.url.endsWith("/api/users/current")) {
		if (await cookieStore.get("FAKE_AUTH")) {
			return new Response("{email:'user@example.com'}", {
				status: 200,
				statusText: "OK",
			});
		}
	}
	return res;
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
