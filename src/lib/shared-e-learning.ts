type SharedELearningParams = {
	organizationSlug: string;
	moduleSlug: string;
	eLearningSlug: string;
};

export const sharedELearningPaths = ({
	organizationSlug,
	moduleSlug,
	eLearningSlug,
}: SharedELearningParams) => {
	const overview = `/delen/${organizationSlug}/${moduleSlug}/${eLearningSlug}`;

	return {
		overview,
		chapter: (chapterId: string) => `${overview}/chapters/${chapterId}`,
		part: (partId: string) => `${overview}/parts/${partId}`,
	};
};
