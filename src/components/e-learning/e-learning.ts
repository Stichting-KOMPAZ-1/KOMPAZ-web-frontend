import type { ChapterResource, PartSummaryResource } from "lib/heyapi";
import z from "zod";

export const eLearningSearchSchema = z.object({
	module: z.optional(z.string()),
});

export const splitChapters = (chapters: readonly ChapterResource[]) => ({
	numbered: chapters.filter((chapter) => !chapter.isSummary),
	summaries: chapters.filter((chapter) => chapter.isSummary),
});

export const orderChapters = (chapters: readonly ChapterResource[]) => {
	const { numbered, summaries } = splitChapters(chapters);
	return [...numbered, ...summaries];
};

type Step =
	| { kind: "chapter"; id: string }
	| { kind: "part"; id: string; chapterId: string };

export const buildSteps = (chapters: readonly ChapterResource[]): Step[] =>
	orderChapters(chapters).flatMap((chapter) => [
		{ kind: "chapter" as const, id: chapter.id },
		...chapter.parts.map((part) => ({
			kind: "part" as const,
			id: part.id,
			chapterId: chapter.id,
		})),
	]);

export const stepPath = (step: Step | undefined, eLearningId: string) => {
	if (!step) return undefined;

	return step.kind === "chapter"
		? `/e-learnings/${eLearningId}/chapters/${step.id}`
		: `/e-learnings/${eLearningId}/parts/${step.id}`;
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
