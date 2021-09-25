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
    description?: string | null;
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
}
