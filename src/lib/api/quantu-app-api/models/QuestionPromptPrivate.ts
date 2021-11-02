/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { QuestionFlashCardPrivate } from './QuestionFlashCardPrivate';
import type { QuestionInputPrivate } from './QuestionInputPrivate';
import type { QuestionMultipleChoicePrivate } from './QuestionMultipleChoicePrivate';

/**
 * Question prompt private
 */
export type QuestionPromptPrivate = (QuestionMultipleChoicePrivate | QuestionFlashCardPrivate | QuestionInputPrivate);
