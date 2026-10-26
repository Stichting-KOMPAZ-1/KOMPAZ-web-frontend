import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import {
	authMeOptions,
	organizationIndexOptions,
} from "lib/heyapi/@tanstack/react-query.gen";
import type { UserResource } from "lib/heyapi/types.gen";
import { canViewAnyOrganization } from "lib/permissions";
import z from "zod";

export const selectedOrganizationSearchSchema = z.object({
	organizationId: z.optional(z.string()),
});

export const organizationsOptions = organizationIndexOptions({
	query: { pageSize: 100 },
});

export const selectedOrganizationFor = (
	user: UserResource,
	organizationId: string | undefined,
) => (canViewAnyOrganization(user) ? organizationId : undefined);

export const readingOrganizationFor = (
	user: UserResource,
	organizationId: string | undefined,
) =>
	canViewAnyOrganization(user)
		? (organizationId ?? user.organizationId)
		: undefined;

export const useSelectedOrganizationId = () => {
	const { data: user } = useSuspenseQuery(authMeOptions());
	const organizationId = useSearch({
		strict: false,
		select: (search) => search.organizationId,
	});

	return selectedOrganizationFor(user, organizationId);
};

export const useReadingOrganizationId = () => {
	const { data: user } = useSuspenseQuery(authMeOptions());

	return readingOrganizationFor(user, useSelectedOrganizationId());
};

export const useSelectedOrganization = () => {
	const organizationId = useSelectedOrganizationId();
	const { data } = useQuery({
		...organizationsOptions,
		enabled: organizationId !== undefined,
		select: (page) => page.items.find(({ id }) => id === organizationId),
	});

	return data;
};

export const useOrganizationLogoUrl = () => {
	const { data: user } = useSuspenseQuery(authMeOptions());
	const selected = useSelectedOrganization();

	if (!selected) return user.organizationLogoUrl;

	return selected.hasLogo ? selected.logoUrl : null;
};
