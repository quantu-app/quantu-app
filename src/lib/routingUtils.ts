import { base } from "$app/paths";

const DEPARTMENTS_SHORT_PATH = "d";
const COURSES_SHORT_PATH = "c";
const CHAPTERS_SHORT_PATH = "ch";
const LESSON_BLOCK_SHORT_PATH = "lb";
const API_PATH = `${base}/api`;

export function departmentPath(departmentUrl: string): string {
    return `${base}/${DEPARTMENTS_SHORT_PATH}/${departmentUrl}`;
}

export function departmentCoursePath(departmentUrl: string, courseUrl: string): string {
    return `${base}/${DEPARTMENTS_SHORT_PATH}/${departmentUrl}/${COURSES_SHORT_PATH}/${courseUrl}`;
}

export function departmentCourseChapterLessonPath(
    departmentUrl: string,
    courseUrl: string,
    chapterUrl: string,
    lessonUrl: string
): string {
    return `${base}/${DEPARTMENTS_SHORT_PATH}/${departmentUrl}/${COURSES_SHORT_PATH}/${courseUrl}/${CHAPTERS_SHORT_PATH}/${chapterUrl}/lessons/${lessonUrl}`;
}

export function departmentCourseChapterLessonLessonBlockPath(
    departmentUrl: string,
    courseUrl: string,
    chapterUrl: string,
    lessonUrl: string,
    lessonBlockUrl: string
): string {
    return `${base}/${DEPARTMENTS_SHORT_PATH}/${departmentUrl}/${COURSES_SHORT_PATH}/${courseUrl}/${CHAPTERS_SHORT_PATH}/${chapterUrl}/lessons/${lessonUrl}/${LESSON_BLOCK_SHORT_PATH}/${lessonBlockUrl}`;
}

export function departmentChallengePath(
    departmentUrl: string,
    challengeUrl: string
): string {
    return `${base}/${DEPARTMENTS_SHORT_PATH}/${departmentUrl}/challenges/${challengeUrl}`;
}

export function departmentChallengeReviewPath(
    departmentUrl: string,
    challengeUrl: string
): string {
    return `${base}/${DEPARTMENTS_SHORT_PATH}/${departmentUrl}/challenges/${challengeUrl}/review`;
}

export function challengesPath(): string {
    return `${base}/challenges`;
}

export function challengesAllPath(): string {
    return `${challengesPath()}/all`;
}

export function coursesPath(): string {
    return `${base}/courses`;
}

/*=====================
== API PATHS
=====================*/

export function apiDepartmentCourseChapterLessonLessonBlockPath(
    departmentId: string,
    courseId: string,
    chapterId: string,
    lessonId: string,
    lessonBlockId: string
): string {
    return `${API_PATH}/departments/${departmentId}/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/lesson-blocks/${lessonBlockId}`;
}

export function apiAssetPath(assetId: string) {
    return `${API_PATH}/assets/${assetId}`;
}