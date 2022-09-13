import { base } from "$app/paths";

const DEPARTMENTS_SHORT_PATH = "d";
const COURSES_SHORT_PATH = "c";
const CHAPTERS_SHORT_PATH = "ch";
const LESSON_BLOCK_SHORT_PATH = "lb";

export function departmentPath(departmentId: string): string {
    return `${base}/${DEPARTMENTS_SHORT_PATH}/${departmentId}`;
}

export function departmentCoursePath(departmentId: string, courseId: string): string {
    return `${base}/${DEPARTMENTS_SHORT_PATH}/${departmentId}/${COURSES_SHORT_PATH}/${courseId}`;
}

export function departmentCourseChapterLessonPath(departmentId: string, courseId: string, chapterId: string, lessonId: string): string {
    return `${base}/${DEPARTMENTS_SHORT_PATH}/${departmentId}/${COURSES_SHORT_PATH}/${courseId}/${CHAPTERS_SHORT_PATH}/${chapterId}/lessons/${lessonId}`;
}

export function departmentCourseChapterLessonLessonBlockPath(
    departmentId: string,
    courseId: string,
    chapterId: string,
    lessonId: string,
    lessonBlockId: string
): string {
    return `${base}/${DEPARTMENTS_SHORT_PATH}/${departmentId}/${COURSES_SHORT_PATH}/${courseId}/${CHAPTERS_SHORT_PATH}/${chapterId}/lessons/${lessonId}/${LESSON_BLOCK_SHORT_PATH}/${lessonBlockId}`;
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
    return `${base}/api/departments/${departmentId}/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/lesson-blocks/${lessonBlockId}`;
}