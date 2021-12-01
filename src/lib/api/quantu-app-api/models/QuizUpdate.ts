/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * quiz update
 */
export type QuizUpdate = {
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
    name?: string | null;
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
}
