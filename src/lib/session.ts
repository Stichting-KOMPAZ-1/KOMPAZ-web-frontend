import { type QueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import { authMeOptions } from "lib/heyapi/@tanstack/react-query.gen";
import type { AuthMeResponse } from "lib/heyapi/types.gen";

const requireUser = (user: AuthMeResponse) => {
	if (!user) throw redirect({ to: "/login" });
	return user;
};

// TODO KOM-114: drop the catch and retry once every backend answers null instead of 401
export const fetchSignedInUser = (queryClient: QueryClient) =>
	queryClient
		.ensureQueryData({ ...authMeOptions(), retry: false })
		.catch(() => null);

export const ensureSignedInUser = async (queryClient: QueryClient) =>
	requireUser(await queryClient.ensureQueryData(authMeOptions()));

export const useSignedInUser = () =>
	requireUser(useSuspenseQuery(authMeOptions()).data);
