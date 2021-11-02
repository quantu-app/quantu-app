/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Question input private prompt
 */
export type QuestionInputPrivate = {
    /**
     * answers
     */
    answers: Array<string>;
    /**
     * question explanation
     */
    explanation?: Array<any> | null;
    /**
     * question content
     */
    question: Array<any>;
    type: QuestionInputPrivate.type;
}

export namespace QuestionInputPrivate {

    export enum type {
        NUMBER = 'number',
        LATEX = 'latex',
        TEXT = 'text',
    }


}
