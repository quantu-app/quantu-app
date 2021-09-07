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
    choices: {
        '.*'?: {
            /**
             * choice content
             */
            content: Array<any>,
        },
    };
    /**
     * question content
     */
    question: Array<any>;
    /**
     * question singleAnswer
     */
    singleAnswer?: boolean | null;
}
