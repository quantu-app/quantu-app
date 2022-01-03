/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { QuestionPromptPrivate } from './QuestionPromptPrivate';

/**
 * question update
 */
export type QuestionUpdate = {
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
    prompt?: QuestionPromptPrivate;
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
    tags?: Array<string> | null;
    /**
     * Question type
     */
    type?: string | null;
}
