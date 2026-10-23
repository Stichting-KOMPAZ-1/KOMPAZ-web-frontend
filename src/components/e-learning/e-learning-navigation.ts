import type { LinkProps } from "@tanstack/react-router";
import { createContext, use } from "react";

export type ELearningNavigationLink = LinkProps;

export type ELearningNavigation = {
	overview: ELearningNavigationLink;
	chapter: (chapterId: string) => ELearningNavigationLink;
	part: (partId: string) => ELearningNavigationLink;
};

export const privateELearningNavigation = (
	eLearningId: string,
): ELearningNavigation => ({
	overview: { to: "/e-learnings/$eLearningId", params: { eLearningId } },
	chapter: (chapterId) => ({
		to: "/e-learnings/$eLearningId/chapters/$chapterId",
		params: { eLearningId, chapterId },
	}),
	part: (partId) => ({
		to: "/e-learnings/$eLearningId/parts/$partId",
		params: { eLearningId, partId },
	}),
});

export const ELearningNavigationContext =
	createContext<ELearningNavigation | null>(null);

export const useELearningNavigation = () => {
	const navigation = use(ELearningNavigationContext);

	if (!navigation)
		throw new Error("ELearningNavigationContext is not provided");

	return navigation;
};
