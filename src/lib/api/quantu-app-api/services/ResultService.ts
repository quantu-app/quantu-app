/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { QuestionResult } from '../models/QuestionResult';
import type { QuestionResultList } from '../models/QuestionResultList';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ResultService {

    /**
     * List Quiz Question's Results
     * Returns organization's questions
     * @param quizId Quiz Id
     * @returns QuestionResultList Quiz Question Results
     * @throws ApiError
     */
    public static quantuAppWebControllerQuestionResultIndex(
        quizId?: number,
    ): CancelablePromise<QuestionResultList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/question-results',
            query: {
                'quizId': quizId,
            },
        });
    }

    /**
     * Get a Question's Result
     * Returns question's result
     * @param id Question Id
     * @returns QuestionResult Organization/Quiz Question
     * @throws ApiError
     */
    public static quantuAppWebControllerQuestionResultShow(
        id: number,
    ): CancelablePromise<QuestionResult> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/question-results/{id}',
            path: {
                'id': id,
            },
        });
    }

}