/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Question } from '../models/Question';
import type { QuestionAnswer } from '../models/QuestionAnswer';
import type { QuestionList } from '../models/QuestionList';
import type { QuestionResult } from '../models/QuestionResult';
import { request as __request } from '../core/request';

export class QuestionService {

    /**
     * List Questions
     * Returns organization's questions
     * @param organizationId Organization Id
     * @param quizId Quiz Id
     * @returns QuestionList Organization/Quiz Questions
     * @throws ApiError
     */
    public static async quantuAppWebControllerQuestionIndex(
        organizationId?: number,
        quizId?: number,
    ): Promise<QuestionList> {
        const result = await __request({
            method: 'GET',
            path: `/questions`,
            query: {
                'organizationId': organizationId,
                'quizId': quizId,
            },
        });
        return result.body;
    }

    /**
     * Get a Question
     * Returns organization's question
     * @param id Question Id
     * @returns Question Organization/Quiz Question
     * @throws ApiError
     */
    public static async quantuAppWebControllerQuestionShow(
        id: number,
    ): Promise<Question> {
        const result = await __request({
            method: 'GET',
            path: `/questions/${id}`,
        });
        return result.body;
    }

    /**
     * Answer a Question
     * Returns correct status
     * @param id Question Id
     * @param requestBody Request body to answer question
     * @returns QuestionResult Question Answer result
     * @throws ApiError
     */
    public static async quantuAppWebControllerQuestionAnswer(
        id: number,
        requestBody: QuestionAnswer,
    ): Promise<QuestionResult> {
        const result = await __request({
            method: 'POST',
            path: `/questions/${id}/answer`,
            body: requestBody,
        });
        return result.body;
    }

}