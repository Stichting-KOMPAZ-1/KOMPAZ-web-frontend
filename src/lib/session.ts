import { type QueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import { authMeOptions } from "lib/heyapi/@tanstack/react-query.gen";
import type { AuthMeResponse } from "lib/heyapi/types.gen";

const requireUser = (user: AuthMeResponse) => {
	if (!user) throw redirect({ to: "/login" });
	return user;
};

export const ensureSignedInUser = async (queryClient: QueryClient) =>
	requireUser(await queryClient.ensureQueryData(authMeOptions()));

export const useSignedInUser = () =>
	requireUser(useSuspenseQuery(authMeOptions()).data);
