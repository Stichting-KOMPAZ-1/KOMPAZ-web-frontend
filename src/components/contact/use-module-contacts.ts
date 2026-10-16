import { useQuery } from "@tanstack/react-query";
import type { ModuleContactResource } from "lib/heyapi";
import { moduleShowOptions } from "lib/heyapi/@tanstack/react-query.gen";

const noContacts: readonly ModuleContactResource[] = [];

export const useModuleContacts = (
	moduleId: string | undefined,
): readonly ModuleContactResource[] => {
	const { data } = useQuery({
		...moduleShowOptions({ path: { module: moduleId ?? "" } }),
		enabled: moduleId !== undefined,
		select: (module) => module.contacts,
	});

	return data ?? noContacts;
};
