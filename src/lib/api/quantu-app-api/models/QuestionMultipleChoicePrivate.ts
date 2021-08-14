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
    choices: {
        '.*'?: {
            /**
             * choice content
             */
            content: Array<any>,
            /**
             * is this choice correct?
             */
            correct?: boolean,
        },
    };
    /**
     * question explanation
     */
    explanation?: Array<any> | null;
    /**
     * question content
     */
    question: Array<any>;
}
