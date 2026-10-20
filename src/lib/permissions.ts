import { useSuspenseQuery } from "@tanstack/react-query";
import { authMeOptions } from "lib/heyapi/@tanstack/react-query.gen";
import type { UserResource, UserRole } from "lib/heyapi/types.gen";

const roleRank: Record<UserRole, number> = {
	Member: 0,
	Administrator: 1,
	PlatformAdministrator: 2,
};

type User = Pick<UserResource, "role">;

const hasRole = (user: User, role: UserRole) =>
	roleRank[user.role] >= roleRank[role];

export const canManageOrganization = (user: User) =>
	hasRole(user, "Administrator");

export const usePermissions = () => {
	const { data: user } = useSuspenseQuery(authMeOptions());

	return {
		canManageOrganization: canManageOrganization(user),
	};
};
