/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Question multiple choice prompt
 */
export type QuestionMultipleChoice = {
    /**
     * answer choices
     */
    choices: Array<{
        /**
         * choice content
         */
        content: Array<any>,
        /**
         * choice key
         */
        key: string,
    }>;
    /**
     * question content
     */
    question: Array<any>;
}
