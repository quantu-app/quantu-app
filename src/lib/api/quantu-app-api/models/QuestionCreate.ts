/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { QuestionPrompt } from './QuestionPrompt';

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
    prompt: QuestionPrompt;
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
    type: string;
}
