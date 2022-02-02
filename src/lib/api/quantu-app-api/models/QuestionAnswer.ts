/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FlashCardAnswer } from './FlashCardAnswer';
import type { InputAnswer } from './InputAnswer';
import type { MarkAsReadAnswer } from './MarkAsReadAnswer';
import type { MultipleChoiceAnswer } from './MultipleChoiceAnswer';

/**
 * Question answer
 */
export type QuestionAnswer = {
    /**
     * Question Answer input
     */
    input?: (FlashCardAnswer | MultipleChoiceAnswer | InputAnswer | MarkAsReadAnswer);
};
