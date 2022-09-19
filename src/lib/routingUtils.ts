import { base } from "$app/paths";

const API_PATH = `${base}/api`;

/**
 * @param departmentUrl
 * @returns "/d/:departmentUrl"
 */
export function departmentPath(departmentUrl: string): string {
    return `${base}/d/${departmentUrl}`;
}

/**
 * @param departmentUrl 
 * @param courseUrl 
 * @returns "/d/:departmentUrl/c/:courseUrl"
 */
export function departmentCoursePath(departmentUrl: string, courseUrl: string): string {
    return `${base}/d/${departmentUrl}/c/${courseUrl}`;
}

/**
 * @param departmentUrl
 * @param courseUrl
 * @param chapterUrl
 * @param lessonUrl
 * @returns "/d/:departmentUrl/c/:courseUrl/ch/:chapterUrl/lessons/:lessonUrl"
 */
export function departmentCourseChapterLessonPath(
    departmentUrl: string,
    courseUrl: string,
    chapterUrl: string,
    lessonUrl: string
): string {
    return `${base}/d/${departmentUrl}/c/${courseUrl}/ch/${chapterUrl}/lessons/${lessonUrl}`;
}

/**
 * @param departmentUrl
 * @param courseUrl
 * @param chapterUrl
 * @param lessonUrl
 * @param lessonBlockUrl
 * @returns "/d/:departmentUrl/c/:courseUrl/ch/:chapterUrl/lessons/:lessonUrl/lb/:lessonBlockUrl"
 */
export function departmentCourseChapterLessonLessonBlockPath(
    departmentUrl: string,
    courseUrl: string,
    chapterUrl: string,
    lessonUrl: string,
    lessonBlockUrl: string
): string {
    return `${base}/d/${departmentUrl}/c/${courseUrl}/ch/${chapterUrl}/lessons/${lessonUrl}/lb/${lessonBlockUrl}`;
}

/**
 * @param departmentUrl
 * @param challengeUrl
 * @returns "/d/:departmentUrl/challenges/:challengeUrl"
 */
export function departmentChallengePath(
    departmentUrl: string,
    challengeUrl: string
): string {
    return `${base}/d/${departmentUrl}/challenges/${challengeUrl}`;
}

/**
 * @param departmentUrl
 * @param challengeUrl
 * @returns "/d/:departmentUrl/challenges/:challengeUrl/review"
 */
export function departmentChallengeReviewPath(
    departmentUrl: string,
    challengeUrl: string
): string {
    return `${base}/d/${departmentUrl}/challenges/${challengeUrl}/review`;
}

/**
 * @returns "/challenges"
 */
export function challengesPath(): string {
    return `${base}/challenges`;
}

/**
 * @returns "/challenges/all"
 */
export function challengesAllPath(): string {
    return `${challengesPath()}/all`;
}

/**
 * @returns "/courses"
 */
export function coursesPath(): string {
    return `${base}/courses`;
}

/*=====================
== API PATHS
=====================*/

/**
 * @param departmentId
 * @param courseId
 * @param chapterId
 * @param lessonId
 * @param lessonBlockId
 * @returns "/api/departments/:departmentId/courses/:courseId/chapters/:chapterId/lessons/:lessonId/lesson-blocks/:lessonBlockId"
 */
export function apiDepartmentCourseChapterLessonLessonBlockPath(
    departmentId: string,
    courseId: string,
    chapterId: string,
    lessonId: string,
    lessonBlockId: string
): string {
    return `${API_PATH}/departments/${departmentId}/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/lesson-blocks/${lessonBlockId}`;
}

/**
 * @param assetId
 * @returns "/api/assets/:assetId"
 */
export function apiAssetPath(assetId: string) {
    return `${API_PATH}/assets/${assetId}`;
}