import type { ChapterResource, PartSummaryResource } from "lib/heyapi";
import z from "zod";

export const eLearningSearchSchema = z.object({
	module: z.optional(z.string()),
});

export const splitChapters = (chapters: readonly ChapterResource[]) => ({
	numbered: chapters.filter((chapter) => !chapter.isSummary),
	summaries: chapters.filter((chapter) => chapter.isSummary),
});

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
