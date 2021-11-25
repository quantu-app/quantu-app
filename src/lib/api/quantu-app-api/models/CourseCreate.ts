/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * course create
 */
export type CourseCreate = {
    /**
     * Course description
     */
    description?: string | null;
    /**
     * Course name
     */
    name: string;
    /**
     * Course published status
     */
    published?: boolean | null;
    /**
     * Course tags
     */
    tags?: Array<string> | null;
}
