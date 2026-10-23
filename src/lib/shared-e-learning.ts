import { linkOptions } from "@tanstack/react-router";
import type { ELearningStepPaths } from "components/e-learning/e-learning-utils";

type SharedELearningParams = {
	organizationSlug: string;
	moduleSlug: string;
	eLearningSlug: string;
};

export const sharedELearningPaths = (
	params: SharedELearningParams,
): ELearningStepPaths => ({
	overview: linkOptions({
		to: "/delen/$organizationSlug/$moduleSlug/$eLearningSlug",
		params,
	}),
	chapter: (chapterId) =>
		linkOptions({
			to: "/delen/$organizationSlug/$moduleSlug/$eLearningSlug/chapters/$chapterId",
			params: { ...params, chapterId },
		}),
	part: (partId) =>
		linkOptions({
			to: "/delen/$organizationSlug/$moduleSlug/$eLearningSlug/parts/$partId",
			params: { ...params, partId },
		}),
});
