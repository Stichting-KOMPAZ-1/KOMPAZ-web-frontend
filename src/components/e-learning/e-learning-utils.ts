import type {
	ChapterResource,
	ELearningResource,
	PartSummaryResource,
} from "lib/heyapi";
import z from "zod";

import type { ELearningNavigation } from "./e-learning-navigation";

export const eLearningSearchSchema = z.object({
	module: z.optional(z.string()),
});

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

const stepLink = (step: Step | undefined, navigation: ELearningNavigation) => {
	if (!step) return undefined;

	return step.kind === "chapter"
		? navigation.chapter(step.id)
		: navigation.part(step.id);
};

export const stepNavigation = (
	eLearning: ELearningResource,
	current: Step,
	navigation: ELearningNavigation,
) => {
	const steps = buildSteps(eLearning);
	const position = steps.findIndex(
		(step) => step.kind === current.kind && step.id === current.id,
	);

	const next = position === -1 ? undefined : steps[position + 1];

	return {
		previousTo: stepLink(steps[position - 1], navigation),
		// TODO: KOM-66 marks the e-learning as completed instead of leaving it
		nextTo: stepLink(next, navigation) ?? navigation.overview,
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
