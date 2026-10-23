import { type LinkProps, linkOptions } from "@tanstack/react-router";
import type {
	ChapterResource,
	ELearningResource,
	PartSummaryResource,
} from "lib/heyapi";
import z from "zod";

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

export type ELearningStepPaths = {
	overview: LinkProps;
	chapter: (chapterId: string) => LinkProps;
	part: (partId: string) => LinkProps;
};

export const eLearningPaths = (eLearningId: string): ELearningStepPaths => ({
	overview: linkOptions({
		to: "/e-learnings/$eLearningId",
		params: { eLearningId },
	}),
	chapter: (chapterId) =>
		linkOptions({
			to: "/e-learnings/$eLearningId/chapters/$chapterId",
			params: { eLearningId, chapterId },
		}),
	part: (partId) =>
		linkOptions({
			to: "/e-learnings/$eLearningId/parts/$partId",
			params: { eLearningId, partId },
		}),
});

const buildSteps = (eLearning: ELearningResource): Step[] =>
	chaptersInReadingOrder(eLearning).flatMap((chapter) => [
		{ kind: "chapter" as const, id: chapter.id },
		...chapter.parts.map((part) => ({ kind: "part" as const, id: part.id })),
	]);

const stepPath = (step: Step | undefined, paths: ELearningStepPaths) => {
	if (!step) return undefined;

	return step.kind === "chapter" ? paths.chapter(step.id) : paths.part(step.id);
};

export const stepLinks = (
	eLearning: ELearningResource,
	current: Step,
	paths: ELearningStepPaths = eLearningPaths(eLearning.id),
) => {
	const steps = buildSteps(eLearning);
	const position = steps.findIndex(
		(step) => step.kind === current.kind && step.id === current.id,
	);

	const next = position === -1 ? undefined : steps[position + 1];

	return {
		previousTo: stepPath(steps[position - 1], paths),
		// TODO: KOM-66 marks the e-learning as completed instead of leaving it
		nextTo: stepPath(next, paths) ?? paths.overview,
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
