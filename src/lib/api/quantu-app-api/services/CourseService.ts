/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Course } from '../models/Course';
import type { CourseCreate } from '../models/CourseCreate';
import type { CourseList } from '../models/CourseList';
import type { CourseUpdate } from '../models/CourseUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CourseService {

    /**
     * List Courses
     * Returns organization's courses
     * @param organizationId Organization Id
     * @returns CourseList Organization Courses
     * @throws ApiError
     */
    public static quantuAppWebControllerUserCourseIndex(
        organizationId: number,
    ): CancelablePromise<CourseList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/organizations/{organization_id}/courses',
            path: {
                'organization_id': organizationId,
            },
        });
    }

    /**
     * Create a Course
     * Returns organization's created course
     * @param organizationId Organization Id
     * @param requestBody Request body to create course
     * @returns Course Organization Course
     * @throws ApiError
     */
    public static quantuAppWebControllerUserCourseCreate(
        organizationId: number,
        requestBody: CourseCreate,
    ): CancelablePromise<Course> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/organizations/{organization_id}/courses',
            path: {
                'organization_id': organizationId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Delete a Course
     * Returns nothing
     * @param id Course Id
     * @param organizationId Organization Id
     * @returns void
     * @throws ApiError
     */
    public static quantuAppWebControllerUserCourseDelete(
        id: number,
        organizationId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/user/organizations/{organization_id}/courses/{id}',
            path: {
                'id': id,
                'organization_id': organizationId,
            },
        });
    }

    /**
     * Get a Course
     * Returns organization's course
     * @param id Course Id
     * @param organizationId Organization Id
     * @returns Course Organization Course
     * @throws ApiError
     */
    public static quantuAppWebControllerUserCourseShow(
        id: number,
        organizationId: number,
    ): CancelablePromise<Course> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/organizations/{organization_id}/courses/{id}',
            path: {
                'id': id,
                'organization_id': organizationId,
            },
        });
    }

    /**
     * Updates a Course
     * Returns organization's updated course
     * @param id Course Id
     * @param organizationId Organization Id
     * @param requestBody Request body to update course
     * @returns Course Organization Course
     * @throws ApiError
     */
    public static quantuAppWebControllerUserCourseUpdate(
        id: number,
        organizationId: number,
        requestBody: CourseUpdate,
    ): CancelablePromise<Course> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/user/organizations/{organization_id}/courses/{id}',
            path: {
                'id': id,
                'organization_id': organizationId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Updates a Course
     * Returns organization's updated course
     * @param id Course Id
     * @param organizationId Organization Id
     * @param requestBody Request body to update course
     * @returns Course Organization Course
     * @throws ApiError
     */
    public static quantuAppWebControllerUserCourseUpdate2(
        id: number,
        organizationId: number,
        requestBody: CourseUpdate,
    ): CancelablePromise<Course> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/user/organizations/{organization_id}/courses/{id}',
            path: {
                'id': id,
                'organization_id': organizationId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get a Course
     * Returns organization's course
     * @param id Course Id
     * @returns Course Organization Course
     * @throws ApiError
     */
    public static quantuAppWebControllerCourseShow(
        id: number,
    ): CancelablePromise<Course> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/courses/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * List Courses
     * Returns organization's courses
     * @param organizationId Organization Id
     * @returns CourseList Organization Courses
     * @throws ApiError
     */
    public static quantuAppWebControllerCourseIndex(
        organizationId?: number,
    ): CancelablePromise<CourseList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/courses',
            query: {
                'organizationId': organizationId,
            },
        });
    }

}