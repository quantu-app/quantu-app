/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * course update
 */
export type CourseUpdate = {
    /**
     * Course description
     */
    description?: Array<any> | null;
    /**
     * Course name
     */
    name?: string | null;
    /**
     * Course published status
     */
    published?: boolean | null;
    /**
     * Course tags
     */
    tags?: Array<string> | null;
};
