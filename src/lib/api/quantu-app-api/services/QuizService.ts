/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Quiz } from '../models/Quiz';
import type { QuizList } from '../models/QuizList';
import { request as __request } from '../core/request';

export class QuizService {

    /**
     * List Quizzes
     * Returns organization's quizzes
     * @param organizationId Organization Id
     * @returns QuizList Organization Quizzes
     * @throws ApiError
     */
    public static async quantuAppWebControllerQuizIndex(
        organizationId?: number,
    ): Promise<QuizList> {
        const result = await __request({
            method: 'GET',
            path: `/quizzes`,
            query: {
                'organizationId': organizationId,
            },
        });
        return result.body;
    }

    /**
     * Get a Quiz
     * Returns organization's quiz
     * @param id Quiz Id
     * @returns Quiz Organization Quiz
     * @throws ApiError
     */
    public static async quantuAppWebControllerQuizShow(
        id: number,
    ): Promise<Quiz> {
        const result = await __request({
            method: 'GET',
            path: `/quizzes/${id}`,
        });
        return result.body;
    }

}