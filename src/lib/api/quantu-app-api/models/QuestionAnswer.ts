/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FlashCardAnswer } from './FlashCardAnswer';
import type { MultipleChoiceAnswer } from './MultipleChoiceAnswer';

/**
 * Question answer
 */
export type QuestionAnswer = {
    /**
     * Question Answer input
     */
    input?: (FlashCardAnswer | MultipleChoiceAnswer);
}
