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
     * Question name
     */
    name?: string | null;
    prompt?: QuestionPromptPrivate;
    /**
     * Quiz Id
     */
    quizId?: number | null;
    /**
     * Question tags
     */
    tags?: Array<string> | null;
    /**
     * Question type
     */
    type?: string | null;
}
