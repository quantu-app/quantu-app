/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * unit create
 */
export type UnitCreate = {
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
    name: string;
    /**
     * Unit published status
     */
    published?: boolean | null;
    /**
     * Unit tags
     */
    tags?: Array<string> | null;
}
