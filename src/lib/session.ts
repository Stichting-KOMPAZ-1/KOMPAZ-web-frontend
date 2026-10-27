import { type QueryClient, useSuspenseQuery } from "@tanstack/react-query";
import {
	type ParsedLocation,
	redirect,
	useLocation,
} from "@tanstack/react-router";
import { authMeOptions } from "lib/heyapi/@tanstack/react-query.gen";
import type { AuthMeResponse } from "lib/heyapi/types.gen";

const requireUser = (user: AuthMeResponse, href: string) => {
	if (!user) {
		throw redirect({
			to: "/login",
			search: { redirect: href !== "/" ? href : undefined },
		});
	}
	return user;
};

export const ensureSignedInUser = async (
	queryClient: QueryClient,
	location: ParsedLocation,
) =>
	requireUser(
		await queryClient.ensureQueryData(authMeOptions()),
		location.href,
	);

export const useSignedInUser = () => {
	const href = useLocation({ select: (location) => location.href });
	return requireUser(useSuspenseQuery(authMeOptions()).data, href);
};
