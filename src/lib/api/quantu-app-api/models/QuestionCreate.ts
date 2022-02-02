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
     * Is this a challenge question?
     */
    isChallenge?: boolean | null;
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
     * When was this question released?
     */
    releasedAt?: string | null;
    /**
     * Question tags
     */
    tags: Array<string>;
    /**
     * Question type
     */
    type: QuestionCreate.type;
};

export namespace QuestionCreate {

    /**
     * Question type
     */
    export enum type {
        FLASH_CARD = 'flash_card',
        MULTIPLE_CHOICE = 'multiple_choice',
        INPUT = 'input',
        MARK_AS_READ = 'mark_as_read',
    }


}
