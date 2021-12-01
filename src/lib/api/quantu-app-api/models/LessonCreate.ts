/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * lesson create
 */
export type LessonCreate = {
    /**
     * Lesson content
     */
    content?: Array<any>;
    /**
     * Lesson description
     */
    description?: Array<any> | null;
    /**
     * Lesson index in unit
     */
    index?: number | null;
    /**
     * Lesson name
     */
    name: string;
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
