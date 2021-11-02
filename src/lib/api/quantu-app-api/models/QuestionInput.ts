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
    type: QuestionInput.type;
}

export namespace QuestionInput {

    export enum type {
        NUMBER = 'number',
        LATEX = 'latex',
        TEXT = 'text',
    }


}
