/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * lesson update
 */
export type LessonUpdate = {
    /**
     * Lesson content
     */
    content?: Array<any>;
    /**
     * Lesson description
     */
    description?: string | null;
    /**
     * Lesson index in unit
     */
    index?: number | null;
    /**
     * Lesson name
     */
    name?: string | null;
    /**
     * Lesson published status
     */
    published?: boolean | null;
    /**
     * Lesson tags
     */
    tags?: Array<string> | null;
    /**
     * Unit Id
     */
    unitId?: number | null;
}
