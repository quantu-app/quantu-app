/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { QuestionAnswer } from './QuestionAnswer';
import type { QuestionPromptPrivate } from './QuestionPromptPrivate';

/**
 * Question result
 */
export type QuestionResult = {
    answer?: QuestionAnswer;
    /**
     * Id
     */
    id?: number;
    /**
     * Creation timestamp
     */
    insertedAt?: string;
    prompt?: QuestionPromptPrivate;
    /**
     * Question Id
     */
    questionId?: number;
    /**
     * Question Answer result
     */
    result?: number;
    /**
     * Question type
     */
    type?: QuestionResult.type;
    /**
     * Update timestamp
     */
    updatedAt?: string;
}

export namespace QuestionResult {

    /**
     * Question type
     */
    export enum type {
        FLASH_CARD = 'flash_card',
        MULTIPLE_CHOICE = 'multiple_choice',
    }


}
