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
    description?: string | null;
    /**
     * Quiz name
     */
    name: string;
    /**
     * Quiz tags
     */
    tags?: Array<string> | null;
}
