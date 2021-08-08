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
     * Creation timestamp
     */
    insertedAt: string;
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
     * Question tags
     */
    tags: Array<string>;
    /**
     * Question type
     */
    type: string;
    /**
     * Update timestamp
     */
    updatedAt: string;
}
