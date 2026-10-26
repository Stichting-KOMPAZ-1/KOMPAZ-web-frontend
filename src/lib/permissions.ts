import type { UserResource, UserRole } from "lib/heyapi/types.gen";
import { useSignedInUser } from "lib/session";

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

export const canShareForAnyOrganization = (user: User) =>
	hasRole(user, "PlatformAdministrator");

export const canViewAnyOrganization = (user: User) =>
	hasRole(user, "PlatformAdministrator");

export const usePermissions = () => {
	const user = useSignedInUser();

	return {
		canManageOrganization: canManageOrganization(user),
		canShareForAnyOrganization: canShareForAnyOrganization(user),
		canViewAnyOrganization: canViewAnyOrganization(user),
	};
};
