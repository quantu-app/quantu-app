/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Question } from '../models/Question';
import type { QuestionAnswer } from '../models/QuestionAnswer';
import type { QuestionCreate } from '../models/QuestionCreate';
import type { QuestionList } from '../models/QuestionList';
import type { QuestionListPrivate } from '../models/QuestionListPrivate';
import type { QuestionPrivate } from '../models/QuestionPrivate';
import type { QuestionResult } from '../models/QuestionResult';
import type { QuestionResultList } from '../models/QuestionResultList';
import type { QuestionUpdate } from '../models/QuestionUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { request as __request } from '../core/request';

export class QuestionService {

    /**
     * Explain a Question
     * Returns Question result with explanation
     * @param id Question Id
     * @returns QuestionResult Question Answer result
     * @throws ApiError
     */
    public static quantuAppWebControllerQuestionExplain(
        id: number,
    ): CancelablePromise<QuestionResult> {
        return __request({
            method: 'POST',
            path: `/questions/${id}/explain`,
        });
    }

    /**
     * List Questions
     * Returns organization's questions
     * @param organizationId Organization Id
     * @param quizId Quiz Id
     * @param isChallenge Is challenge
     * @returns QuestionList Organization/Quiz Questions
     * @throws ApiError
     */
    public static quantuAppWebControllerQuestionIndex(
        organizationId?: number,
        quizId?: number,
        isChallenge?: boolean,
    ): CancelablePromise<QuestionList> {
        return __request({
            method: 'GET',
            path: `/questions`,
            query: {
                'organizationId': organizationId,
                'quizId': quizId,
                'isChallenge': isChallenge,
            },
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
        return __request({
            method: 'GET',
            path: `/question-results`,
            query: {
                'quizId': quizId,
            },
        });
    }

    /**
     * Answer a Question
     * Returns correct status
     * @param id Question Id
     * @param requestBody Request body to answer question
     * @returns QuestionResult Question Answer result
     * @throws ApiError
     */
    public static quantuAppWebControllerQuestionAnswer(
        id: number,
        requestBody: QuestionAnswer,
    ): CancelablePromise<QuestionResult> {
        return __request({
            method: 'POST',
            path: `/questions/${id}/answer`,
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * List Questions
     * Returns organization's questions
     * @param organizationId Organization Id
     * @param quizId Quiz Id
     * @returns QuestionListPrivate Organization/Quiz Questions
     * @throws ApiError
     */
    public static quantuAppWebControllerUserQuestionIndex(
        organizationId: number,
        quizId?: number,
    ): CancelablePromise<QuestionListPrivate> {
        return __request({
            method: 'GET',
            path: `/user/organizations/${organizationId}/questions`,
            query: {
                'quizId': quizId,
            },
        });
    }

    /**
     * Create a Question
     * Returns organization's created question
     * @param organizationId Organization Id
     * @param requestBody Request body to create question
     * @returns QuestionPrivate Organization/Quiz Question
     * @throws ApiError
     */
    public static quantuAppWebControllerUserQuestionCreate(
        organizationId: number,
        requestBody: QuestionCreate,
    ): CancelablePromise<QuestionPrivate> {
        return __request({
            method: 'POST',
            path: `/user/organizations/${organizationId}/questions`,
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get a Question
     * Returns organization's question
     * @param id Question Id
     * @returns Question Organization/Quiz Question
     * @throws ApiError
     */
    public static quantuAppWebControllerQuestionShow(
        id: number,
    ): CancelablePromise<Question> {
        return __request({
            method: 'GET',
            path: `/questions/${id}`,
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
        return __request({
            method: 'GET',
            path: `/question-results/${id}`,
        });
    }

    /**
     * Delete a Question
     * Returns nothing
     * @param id Question Id
     * @param organizationId Organization Id
     * @returns void
     * @throws ApiError
     */
    public static quantuAppWebControllerUserQuestionDelete(
        id: number,
        organizationId: number,
    ): CancelablePromise<void> {
        return __request({
            method: 'DELETE',
            path: `/user/organizations/${organizationId}/questions/${id}`,
        });
    }

    /**
     * Get a Question
     * Returns organization's question
     * @param id Question Id
     * @param organizationId Organization Id
     * @returns QuestionPrivate Organization/Quiz Question
     * @throws ApiError
     */
    public static quantuAppWebControllerUserQuestionShow(
        id: number,
        organizationId: number,
    ): CancelablePromise<QuestionPrivate> {
        return __request({
            method: 'GET',
            path: `/user/organizations/${organizationId}/questions/${id}`,
        });
    }

    /**
     * Updates a Question
     * Returns organization's updated question
     * @param id Question Id
     * @param organizationId Organization Id
     * @param requestBody Request body to update question
     * @returns QuestionPrivate Organization/Quiz Question
     * @throws ApiError
     */
    public static quantuAppWebControllerUserQuestionUpdate(
        id: number,
        organizationId: number,
        requestBody: QuestionUpdate,
    ): CancelablePromise<QuestionPrivate> {
        return __request({
            method: 'PATCH',
            path: `/user/organizations/${organizationId}/questions/${id}`,
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Updates a Question
     * Returns organization's updated question
     * @param id Question Id
     * @param organizationId Organization Id
     * @param requestBody Request body to update question
     * @returns QuestionPrivate Organization/Quiz Question
     * @throws ApiError
     */
    public static quantuAppWebControllerUserQuestionUpdate2(
        id: number,
        organizationId: number,
        requestBody: QuestionUpdate,
    ): CancelablePromise<QuestionPrivate> {
        return __request({
            method: 'PUT',
            path: `/user/organizations/${organizationId}/questions/${id}`,
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}