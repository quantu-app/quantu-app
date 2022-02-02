/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Question input prompt
 */
export type QuestionInput = {
    /**
     * question explanation
     */
    explanation?: Array<any> | null;
    /**
     * question content
     */
    question: Array<any>;
    /**
     * question input type
     */
    type: QuestionInput.type;
};

export namespace QuestionInput {

    /**
     * question input type
     */
    export enum type {
        NUMBER = 'number',
        LATEX = 'latex',
        TEXT = 'text',
    }


}
