/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { QuestionResult } from '../models/QuestionResult';
import type { QuestionResultList } from '../models/QuestionResultList';
import type { Quiz } from '../models/Quiz';
import type { QuizCreate } from '../models/QuizCreate';
import type { QuizList } from '../models/QuizList';
import type { QuizQuestionIds } from '../models/QuizQuestionIds';
import type { QuizUpdate } from '../models/QuizUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class QuizService {

    /**
     * Get a Quiz
     * Returns organization's quiz
     * @param id Quiz Id
     * @returns Quiz Organization Quiz
     * @throws ApiError
     */
    public static quantuAppWebControllerQuizShow(
        id: number,
    ): CancelablePromise<Quiz> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/quizzes/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * List Quizzes
     * Returns organization's quizzes
     * @param organizationId Organization Id
     * @param unitId Quiz Unit Id
     * @returns QuizList Organization Quizzes
     * @throws ApiError
     */
    public static quantuAppWebControllerUserQuizIndex(
        organizationId: number,
        unitId?: number,
    ): CancelablePromise<QuizList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/organizations/{organization_id}/quizzes',
            path: {
                'organization_id': organizationId,
            },
            query: {
                'unitId': unitId,
            },
        });
    }

    /**
     * Create a Quiz
     * Returns organization's created quiz
     * @param organizationId Organization Id
     * @param requestBody Request body to create quiz
     * @returns Quiz Organization Quiz
     * @throws ApiError
     */
    public static quantuAppWebControllerUserQuizCreate(
        organizationId: number,
        requestBody: QuizCreate,
    ): CancelablePromise<Quiz> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/organizations/{organization_id}/quizzes',
            path: {
                'organization_id': organizationId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Add Quertions to Quiz
     * Returns nothing
     * @param id Quiz Id
     * @param organizationId Organization Id
     * @param requestBody Request body to add questions to quiz
     * @returns void
     * @throws ApiError
     */
    public static quantuAppWebControllerUserQuizAddQuestions(
        id: number,
        organizationId: number,
        requestBody: QuizQuestionIds,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/organizations/{organization_id}/quizzes/{id}/add-questions',
            path: {
                'id': id,
                'organization_id': organizationId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

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
     * Remove Quertions from Quiz
     * Returns nothing
     * @param id Quiz Id
     * @param organizationId Organization Id
     * @param requestBody Request body to remove questions from quiz
     * @returns void
     * @throws ApiError
     */
    public static quantuAppWebControllerUserQuizRemoveQuestions(
        id: number,
        organizationId: number,
        requestBody: QuizQuestionIds,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/organizations/{organization_id}/quizzes/{id}/remove-questions',
            path: {
                'id': id,
                'organization_id': organizationId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Delete a Quiz
     * Returns nothing
     * @param id Quiz Id
     * @param organizationId Organization Id
     * @returns void
     * @throws ApiError
     */
    public static quantuAppWebControllerUserQuizDelete(
        id: number,
        organizationId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/user/organizations/{organization_id}/quizzes/{id}',
            path: {
                'id': id,
                'organization_id': organizationId,
            },
        });
    }

    /**
     * Get a Quiz
     * Returns organization's quiz
     * @param id Quiz Id
     * @param organizationId Organization Id
     * @returns Quiz Organization Quiz
     * @throws ApiError
     */
    public static quantuAppWebControllerUserQuizShow(
        id: number,
        organizationId: number,
    ): CancelablePromise<Quiz> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/organizations/{organization_id}/quizzes/{id}',
            path: {
                'id': id,
                'organization_id': organizationId,
            },
        });
    }

    /**
     * Updates a Quiz
     * Returns organization's updated quiz
     * @param id Quiz Id
     * @param organizationId Organization Id
     * @param requestBody Request body to update quiz
     * @returns Quiz Organization Quiz
     * @throws ApiError
     */
    public static quantuAppWebControllerUserQuizUpdate(
        id: number,
        organizationId: number,
        requestBody: QuizUpdate,
    ): CancelablePromise<Quiz> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/user/organizations/{organization_id}/quizzes/{id}',
            path: {
                'id': id,
                'organization_id': organizationId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Updates a Quiz
     * Returns organization's updated quiz
     * @param id Quiz Id
     * @param organizationId Organization Id
     * @param requestBody Request body to update quiz
     * @returns Quiz Organization Quiz
     * @throws ApiError
     */
    public static quantuAppWebControllerUserQuizUpdate2(
        id: number,
        organizationId: number,
        requestBody: QuizUpdate,
    ): CancelablePromise<Quiz> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/user/organizations/{organization_id}/quizzes/{id}',
            path: {
                'id': id,
                'organization_id': organizationId,
            },
            body: requestBody,
            mediaType: 'application/json',
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

    /**
     * List Quizzes
     * Returns organization's quizzes
     * @param organizationId Organization Id
     * @param unitId Unit Id
     * @returns QuizList Organization Quizzes
     * @throws ApiError
     */
    public static quantuAppWebControllerQuizIndex(
        organizationId?: number,
        unitId?: number,
    ): CancelablePromise<QuizList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/quizzes',
            query: {
                'organizationId': organizationId,
                'unitId': unitId,
            },
        });
    }

}