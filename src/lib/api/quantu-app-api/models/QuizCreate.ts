/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * quiz create
 */
export type QuizCreate = {
    /**
     * Quiz description
     */
    description?: Array<any> | null;
    /**
     * Quiz index in unit
     */
    index?: number | null;
    /**
     * Quiz name
     */
    name: string;
    /**
     * Quiz published status
     */
    published?: boolean | null;
    /**
     * Quiz tags
     */
    tags?: Array<string> | null;
    /**
     * Unit Id
     */
    unitId?: number | null;
};
