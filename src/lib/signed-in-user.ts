import { type QueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { authMeOptions } from "lib/heyapi/@tanstack/react-query.gen";
import type { UserResource } from "lib/heyapi/types.gen";

const requireUser = (user: UserResource | null) => {
	if (user === null) {
		throw new Error(
			"No one is signed in; this is only reachable behind the /_app guard.",
		);
	}
	return user;
};

/**
 * Who is signed in, or `null` when nobody is. `/auth/me` answers `null`
 * rather than 401 for a visitor without a session, so an error here means the
 * request itself failed and is treated the same as nobody.
 *
 * @example
 * if ((await fetchSignedInUser(queryClient)) === null) throw redirect({ to: "/login" });
 */
export const fetchSignedInUser = (
	queryClient: QueryClient,
	options: { retry?: boolean } = {},
): Promise<UserResource | null> =>
	queryClient
		.ensureQueryData({ ...authMeOptions(), ...options })
		.catch(() => null);

/**
 * The signed-in user, for loaders behind the `/_app` guard, which has
 * already sent everybody else to the login page.
 *
 * @example
 * const user = await ensureSignedInUser(context.queryClient);
 */
export const ensureSignedInUser = async (
	queryClient: QueryClient,
): Promise<UserResource> =>
	requireUser(await queryClient.ensureQueryData(authMeOptions()));

/**
 * The signed-in user, for components rendered behind the `/_app` guard or
 * only once a user is known.
 *
 * @example
 * const user = useSignedInUser();
 */
export const useSignedInUser = (): UserResource =>
	requireUser(useSuspenseQuery(authMeOptions()).data);
