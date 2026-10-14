import type {
	ChapterResource,
	ELearningResource,
	PartSummaryResource,
} from "lib/heyapi";
import z from "zod";

export const eLearningSearchSchema = z.object({
	module: z.optional(z.string()),
});

export const findChapter = (
	eLearning:
		| Pick<ELearningResource, "numberedChapters" | "summaryChapters">
		| undefined,
	chapterId: string,
): ChapterResource | undefined =>
	eLearning &&
	[...eLearning.numberedChapters, ...eLearning.summaryChapters].find(
		(chapter) => chapter.id === chapterId,
	);

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
