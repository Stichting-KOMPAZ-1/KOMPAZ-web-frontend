import { linkOptions } from "@tanstack/react-router";
import type {
	ChapterResource,
	ELearningResource,
	PartSummaryResource,
	SharedELearningShowThroughModuleData,
} from "lib/heyapi";

export const chaptersInReadingOrder = ({
	numberedChapters,
	summaryChapters,
}: ELearningResource) => [...numberedChapters, ...summaryChapters];

export const findChapter = (eLearning: ELearningResource, chapterId: string) =>
	chaptersInReadingOrder(eLearning).find((chapter) => chapter.id === chapterId);

type Step = { kind: "chapter" | "part"; id: string };

const buildSteps = (eLearning: ELearningResource): Step[] =>
	chaptersInReadingOrder(eLearning).flatMap((chapter) => [
		{ kind: "chapter" as const, id: chapter.id },
		...chapter.parts.map((part) => ({ kind: "part" as const, id: part.id })),
	]);

type SharedELearningParams = SharedELearningShowThroughModuleData["path"];

const stepLink = (params: SharedELearningParams, step: Step | undefined) => {
	if (!step) return undefined;

	return step.kind === "chapter"
		? chapterLink(params, step.id)
		: partLink(params, step.id);
};

export const stepLinks = (
	params: SharedELearningParams,
	eLearning: ELearningResource,
	current: Step,
) => {
	const steps = buildSteps(eLearning);
	const position = steps.findIndex(
		(step) => step.kind === current.kind && step.id === current.id,
	);

	const next = position === -1 ? undefined : steps[position + 1];

	return {
		previousTo: stepLink(params, steps[position - 1]),
		// TODO: KOM-66 marks the e-learning as completed instead of leaving it
		nextTo: stepLink(params, next) ?? overviewLink(params),
		isLastStep: !next,
	};
};

const isChapterComplete = (
	chapter: ChapterResource,
	completedPartIds: ReadonlySet<string>,
) =>
	chapter.parts.length > 0 &&
	chapter.parts.every((part) => completedPartIds.has(part.id));

export const findNextChapter = (
	chapters: readonly ChapterResource[],
	completedPartIds: ReadonlySet<string>,
): ChapterResource | undefined =>
	chapters.find((chapter) => !isChapterComplete(chapter, completedPartIds));

export const findNextPart = (
	chapter: ChapterResource | undefined,
	completedPartIds: ReadonlySet<string>,
): PartSummaryResource | undefined =>
	chapter?.parts.find((part) => !completedPartIds.has(part.id));

export const sharedELearningPath = ({
	organizationSlug,
	moduleSlug,
	eLearningSlug,
}: SharedELearningParams) => ({ organizationSlug, moduleSlug, eLearningSlug });

export const overviewLink = (params: SharedELearningParams) =>
	linkOptions({
		to: "/delen/$organizationSlug/$moduleSlug/$eLearningSlug",
		params: sharedELearningPath(params),
	});

export const chapterLink = (params: SharedELearningParams, chapterId: string) =>
	linkOptions({
		to: "/delen/$organizationSlug/$moduleSlug/$eLearningSlug/chapters/$chapterId",
		params: { ...sharedELearningPath(params), chapterId },
	});

export const partLink = (params: SharedELearningParams, partId: string) =>
	linkOptions({
		to: "/delen/$organizationSlug/$moduleSlug/$eLearningSlug/parts/$partId",
		params: { ...sharedELearningPath(params), partId },
	});
