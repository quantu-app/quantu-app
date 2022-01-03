/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { QuestionPrompt } from './QuestionPrompt';

/**
 * question show
 */
export type Question = {
    /**
     * Id
     */
    id: number;
    /**
     * Question index in quiz
     */
    index?: number | null;
    /**
     * Creation timestamp
     */
    insertedAt: string;
    /**
     * Is this a challenge question?
     */
    isChallenge?: boolean;
    /**
     * Question name
     */
    name: string | null;
    /**
     * Organization Id
     */
    organizationId: number;
    prompt: QuestionPrompt;
    /**
     * Quiz Id
     */
    quizId?: number | null;
    /**
     * When was this question released?
     */
    releasedAt?: string;
    /**
     * Question tags
     */
    tags: Array<string>;
    /**
     * Question type
     */
    type: Question.type;
    /**
     * Update timestamp
     */
    updatedAt: string;
}

export namespace Question {

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
