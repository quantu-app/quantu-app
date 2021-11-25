/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * unit update
 */
export type UnitUpdate = {
    /**
     * Unit Course Id
     */
    courseId?: number | null;
    /**
     * Unit description
     */
    description?: string | null;
    /**
     * Unit index in unit
     */
    index?: number | null;
    /**
     * Unit name
     */
    name?: string | null;
    /**
     * Unit published status
     */
    published?: boolean | null;
    /**
     * Unit tags
     */
    tags?: Array<string> | null;
}
