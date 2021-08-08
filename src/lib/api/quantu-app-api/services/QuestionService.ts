/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Question } from '../models/Question';
import type { QuestionList } from '../models/QuestionList';
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

}