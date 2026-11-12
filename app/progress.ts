import { LESSONS, getLesson, type LessonId } from "./questions.ts";
export type Progress = { stars: number; rounds: number; stickers: string[]; lessons: Partial<Record<LessonId, number>> };
export const EMPTY: Progress = { stars: 0, rounds: 0, stickers: [], lessons: {} };
const pals = ["basilisk", "zombie", "croc"];
export function restoreProgress(saved: unknown): Progress {
  if (!saved || typeof saved !== "object") return { ...EMPTY, lessons: {}, stickers: [] };
  const data = saved as Record<string, unknown>;
  const integer = (value: unknown) => typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
  if (!integer(data.stars) || !integer(data.rounds) || !Array.isArray(data.stickers)) return { ...EMPTY, lessons: {}, stickers: [] };
  const valid = pals.flatMap(p => [`${p}-english`, `${p}-zhuyin`]);
  const lessons: Progress["lessons"] = {};
  if (data.lessons && typeof data.lessons === "object") for (const lesson of LESSONS) {
    const value = (data.lessons as Record<string, unknown>)[lesson.id];
    if (integer(value)) lessons[lesson.id] = value as number;
  }
  return { stars: data.stars as number, rounds: data.rounds as number, stickers: [...new Set(data.stickers.filter((id): id is string => typeof id === "string" && valid.includes(id)))], lessons };
}
export function finishRound(progress: Progress, pal: string, lesson: LessonId, count: number): Progress {
  return { stars: progress.stars + count, rounds: progress.rounds + 1,
    stickers: [...new Set([...progress.stickers, `${pal}-${getLesson(lesson).subject}`])],
    lessons: { ...progress.lessons, [lesson]: (progress.lessons[lesson] || 0) + 1 },
  };
}
