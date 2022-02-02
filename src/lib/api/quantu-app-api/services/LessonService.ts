/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Lesson } from '../models/Lesson';
import type { LessonCreate } from '../models/LessonCreate';
import type { LessonList } from '../models/LessonList';
import type { LessonUpdate } from '../models/LessonUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class LessonService {

    /**
     * List Lessons
     * Returns organization's lessons
     * @param organizationId Organization Id
     * @param unitId Lesson Unit Id
     * @returns LessonList Organization Lessons
     * @throws ApiError
     */
    public static quantuAppWebControllerUserLessonIndex(
        organizationId: number,
        unitId?: number,
    ): CancelablePromise<LessonList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/organizations/{organization_id}/lessons',
            path: {
                'organization_id': organizationId,
            },
            query: {
                'unitId': unitId,
            },
        });
    }

    /**
     * Create a Lesson
     * Returns organization's created lesson
     * @param organizationId Organization Id
     * @param requestBody Request body to create lesson
     * @returns Lesson Organization Lesson
     * @throws ApiError
     */
    public static quantuAppWebControllerUserLessonCreate(
        organizationId: number,
        requestBody: LessonCreate,
    ): CancelablePromise<Lesson> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/organizations/{organization_id}/lessons',
            path: {
                'organization_id': organizationId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get a Lesson
     * Returns organization's lesson
     * @param id Lesson Id
     * @returns Lesson Organization Lesson
     * @throws ApiError
     */
    public static quantuAppWebControllerLessonShow(
        id: number,
    ): CancelablePromise<Lesson> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/lessons/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * List Lessons
     * Returns organization's lessons
     * @param organizationId Organization Id
     * @param unitId Unit Id
     * @returns LessonList Organization Lessons
     * @throws ApiError
     */
    public static quantuAppWebControllerLessonIndex(
        organizationId?: number,
        unitId?: number,
    ): CancelablePromise<LessonList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/lessons',
            query: {
                'organizationId': organizationId,
                'unitId': unitId,
            },
        });
    }

    /**
     * Delete a Lesson
     * Returns nothing
     * @param id Lesson Id
     * @param organizationId Organization Id
     * @returns void
     * @throws ApiError
     */
    public static quantuAppWebControllerUserLessonDelete(
        id: number,
        organizationId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/user/organizations/{organization_id}/lessons/{id}',
            path: {
                'id': id,
                'organization_id': organizationId,
            },
        });
    }

    /**
     * Get a Lesson
     * Returns organization's lesson
     * @param id Lesson Id
     * @param organizationId Organization Id
     * @returns Lesson Organization Lesson
     * @throws ApiError
     */
    public static quantuAppWebControllerUserLessonShow(
        id: number,
        organizationId: number,
    ): CancelablePromise<Lesson> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/organizations/{organization_id}/lessons/{id}',
            path: {
                'id': id,
                'organization_id': organizationId,
            },
        });
    }

    /**
     * Updates a Lesson
     * Returns organization's updated lesson
     * @param id Lesson Id
     * @param organizationId Organization Id
     * @param requestBody Request body to update lesson
     * @returns Lesson Organization Lesson
     * @throws ApiError
     */
    public static quantuAppWebControllerUserLessonUpdate(
        id: number,
        organizationId: number,
        requestBody: LessonUpdate,
    ): CancelablePromise<Lesson> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/user/organizations/{organization_id}/lessons/{id}',
            path: {
                'id': id,
                'organization_id': organizationId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Updates a Lesson
     * Returns organization's updated lesson
     * @param id Lesson Id
     * @param organizationId Organization Id
     * @param requestBody Request body to update lesson
     * @returns Lesson Organization Lesson
     * @throws ApiError
     */
    public static quantuAppWebControllerUserLessonUpdate2(
        id: number,
        organizationId: number,
        requestBody: LessonUpdate,
    ): CancelablePromise<Lesson> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/user/organizations/{organization_id}/lessons/{id}',
            path: {
                'id': id,
                'organization_id': organizationId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}