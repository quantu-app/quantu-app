import { base } from '$app/paths';

const API_PATH = `${base}/api`;

/**
 * @returns "/d/:departmentUrl"
 */
export function departmentPath(departmentUrl: string): string {
	return `${base}/d/${departmentUrl}`;
}

/**
 * @returns "/d/:departmentUrl/c/:courseUrl"
 */
export function departmentCoursePath(departmentUrl: string, courseUrl: string): string {
	return `${base}/d/${departmentUrl}/c/${courseUrl}`;
}

/**
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
 * @returns "/d/:departmentUrl/challenges/:challengeUrl"
 */
export function departmentChallengePath(departmentUrl: string, challengeUrl: string): string {
	return `${base}/d/${departmentUrl}/challenges/${challengeUrl}`;
}

/**
 * @returns "/d/:departmentUrl/challenges/:challengeUrl/review"
 */
export function departmentChallengeReviewPath(departmentUrl: string, challengeUrl: string): string {
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

/**
 * @returns "/user/welcome"
 */
export function userWelcomePath() {
	return `${base}/user/welcome`;
}

/*=====================
== API PATHS
=====================*/

/**
 * @returns "/api/departments"
 */
export function apiDepartmentsPath() {
	return `${API_PATH}/departments`;
}

/**
 * @returns "/api/departments/:departmentUrl"
 */
export function apiDepartmentPath(departmentUrl: string) {
	return `${API_PATH}/departments/${departmentUrl}`;
}

/**
 * @returns "/api/departments/:departmentUrl/courses"
 */
export function apiDepartmentCoursesPath(departmentUrl: string) {
	return `${API_PATH}/departments/${departmentUrl}/courses`;
}

/**
 * @returns "/api/departments/:departmentUrl/courses/:courseUrl"
 */
export function apiDepartmentCoursePath(departmentUrl: string, courseUrl: string) {
	return `${API_PATH}/departments/${departmentUrl}/courses/${courseUrl}`;
}

/**
 * @returns "/api/departments/:departmentUrl/courses/:courseUrl/chapters"
 */
export function apiDepartmentCourseChaptersPath(departmentUrl: string, courseUrl: string): string {
	return `${API_PATH}/departments/${departmentUrl}/courses/${courseUrl}/chapters`;
}

/**
 * @returns "/api/departments/:departmentUrl/courses/:courseUrl/chapters/:chapterUrl"
 */
export function apiDepartmentCourseChapterPath(
	departmentUrl: string,
	courseUrl: string,
	chapterUrl: string
): string {
	return `${API_PATH}/departments/${departmentUrl}/courses/${courseUrl}/chapters/${chapterUrl}`;
}

/**
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
 * @returns "/api/departments/:departmentUrl/challenges/:challengeUrl"
 */
export function apiDepartmentChallengePath(departmentUrl: string, challengeUrl: string): string {
	return `${API_PATH}/departments/${departmentUrl}/challenges/${challengeUrl}`;
}

/**
 * @returns "/api/departments/:departmentUrl/challenges"
 */
export function apiDepartmentChallengesPath(departmentUrl: string): string {
	return `${API_PATH}/departments/${departmentUrl}/challenges`;
}
/**
 * @returns "/api/departments/:departmentUrl/courses/:courseUrl/chapters/:chapterUrl/lessons/:lessonUrl"
 */
export function apiDepartmentCourseChapterLessonPath(
	departmentUrl: string,
	courseUrl: string,
	chapterUrl: string,
	lessonUrl: string
): string {
	return `${API_PATH}/departments/${departmentUrl}/courses/${courseUrl}/chapters/${chapterUrl}/lessons/${lessonUrl}`;
}

/**
 * @returns "/api/departments/:departmentUrl/courses/:courseUrl/chapters/:chapterUrl/lessons"
 */
export function apiDepartmentCourseChapterLessonsPath(
	departmentUrl: string,
	courseUrl: string,
	chapterUrl: string
): string {
	return `${API_PATH}/departments/${departmentUrl}/courses/${courseUrl}/chapters/${chapterUrl}/lessons`;
}

/**
 * @returns "/api/departments/:departmentUrl/courses/:courseUrl/chapters/:chapterUrl/lessons/:lessonUrl/redo"
 */
export function apiDepartmentCourseChapterLessonRedoPath(
	departmentUrl: string,
	courseUrl: string,
	chapterUrl: string,
	lessonUrl: string
): string {
	return `${API_PATH}/departments/${departmentUrl}/courses/${courseUrl}/chapters/${chapterUrl}/lessons/${lessonUrl}/redo`;
}

/**
 * @returns "/api/courses"
 */
export function apiCoursesPath(): string {
	return `${API_PATH}/courses`;
}

/**
 * @returns "/api/challenges"
 */
export function apiChallengesPath(): string {
	return `${API_PATH}/challenges`;
}

/**
 * @returns "/api/results/challenge/:challengeId"
 */
export function apiResultsChallengePath(challengeId: string): string {
	return `${API_PATH}/results/challenge/${challengeId}`;
}
/**
 * @returns "/api/results/challenges/:challengeId/explain"
 */
export function apiResultsChallengeExplainPath(challengeId: string): string {
	return `${API_PATH}/results/challenge/${challengeId}/explain`;
}

/**
 * @returns "/api/assets/:assetId"
 */
export function apiAssetPath(assetId: string) {
	return `${API_PATH}/assets/${assetId}`;
}

/**
 * @returns "/api/user"
 */
export function apiUserPath() {
	return `${API_PATH}/user`;
}

/**
 * @returns "/api/user/settings"
 */
export function apiUserSettingsPath() {
	return `${API_PATH}/user/settings`;
}
