/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Question multiple choice private prompt
 */
export type QuestionMultipleChoicePrivate = {
    /**
     * answer choices
     */
    choices: Array<{
        /**
         * choice content
         */
        content: Array<any>,
        /**
         * is this choice correct?
         */
        correct?: boolean,
        /**
         * choice key
         */
        key: string,
    }>;
    /**
     * question explanation
     */
    explanation?: Array<any> | null;
    /**
     * question content
     */
    question: Array<any>;
}
