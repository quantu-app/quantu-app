/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { QuestionPromptPrivate } from './QuestionPromptPrivate';

/**
 * question create
 */
export type QuestionCreate = {
    /**
     * Quiz Index
     */
    index?: number | null;
    /**
     * Question name
     */
    name?: string | null;
    prompt: QuestionPromptPrivate;
    /**
     * Quiz Id
     */
    quizId?: number | null;
    /**
     * Question tags
     */
    tags: Array<string>;
    /**
     * Question type
     */
    type: QuestionCreate.type;
}

export namespace QuestionCreate {

    /**
     * Question type
     */
    export enum type {
        FLASH_CARD = 'flash_card',
        MULTIPLE_CHOICE = 'multiple_choice',
        INPUT = 'input',
    }


}
