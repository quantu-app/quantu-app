/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Unit } from '../models/Unit';
import type { UnitChildList } from '../models/UnitChildList';
import type { UnitCreate } from '../models/UnitCreate';
import type { UnitList } from '../models/UnitList';
import type { UnitUpdate } from '../models/UnitUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UnitService {

    /**
     * List Units
     * Returns organization's units
     * @param organizationId Organization Id
     * @param courseId Unit Id
     * @returns UnitList Organization Units
     * @throws ApiError
     */
    public static quantuAppWebControllerUnitIndex(
        organizationId?: number,
        courseId?: number,
    ): CancelablePromise<UnitList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/units',
            query: {
                'organizationId': organizationId,
                'courseId': courseId,
            },
        });
    }

    /**
     * Get a Unit
     * Returns organization's unit
     * @param id Unit Id
     * @returns Unit Organization Unit
     * @throws ApiError
     */
    public static quantuAppWebControllerUnitShow(
        id: number,
    ): CancelablePromise<Unit> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/units/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Get a Unit's children
     * Returns organization's unit's children
     * @param id Unit Id
     * @param organizationId Organization Id
     * @returns UnitChildList Organization Unit
     * @throws ApiError
     */
    public static quantuAppWebControllerUserUnitChildren(
        id: number,
        organizationId: number,
    ): CancelablePromise<UnitChildList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/organizations/{organization_id}/units/{id}/children',
            path: {
                'id': id,
                'organization_id': organizationId,
            },
        });
    }

    /**
     * Delete a Unit
     * Returns nothing
     * @param id Unit Id
     * @param organizationId Organization Id
     * @returns void
     * @throws ApiError
     */
    public static quantuAppWebControllerUserUnitDelete(
        id: number,
        organizationId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/user/organizations/{organization_id}/units/{id}',
            path: {
                'id': id,
                'organization_id': organizationId,
            },
        });
    }

    /**
     * Get a Unit
     * Returns organization's unit
     * @param id Unit Id
     * @param organizationId Organization Id
     * @returns Unit Organization Unit
     * @throws ApiError
     */
    public static quantuAppWebControllerUserUnitShow(
        id: number,
        organizationId: number,
    ): CancelablePromise<Unit> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/organizations/{organization_id}/units/{id}',
            path: {
                'id': id,
                'organization_id': organizationId,
            },
        });
    }

    /**
     * Updates a Unit
     * Returns organization's updated unit
     * @param id Unit Id
     * @param organizationId Organization Id
     * @param requestBody Request body to update unit
     * @returns Unit Organization Unit
     * @throws ApiError
     */
    public static quantuAppWebControllerUserUnitUpdate(
        id: number,
        organizationId: number,
        requestBody: UnitUpdate,
    ): CancelablePromise<Unit> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/user/organizations/{organization_id}/units/{id}',
            path: {
                'id': id,
                'organization_id': organizationId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Updates a Unit
     * Returns organization's updated unit
     * @param id Unit Id
     * @param organizationId Organization Id
     * @param requestBody Request body to update unit
     * @returns Unit Organization Unit
     * @throws ApiError
     */
    public static quantuAppWebControllerUserUnitUpdate2(
        id: number,
        organizationId: number,
        requestBody: UnitUpdate,
    ): CancelablePromise<Unit> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/user/organizations/{organization_id}/units/{id}',
            path: {
                'id': id,
                'organization_id': organizationId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * List Units
     * Returns organization's units
     * @param organizationId Organization Id
     * @param courseId Unit Course Id
     * @returns UnitList Organization Units
     * @throws ApiError
     */
    public static quantuAppWebControllerUserUnitIndex(
        organizationId: number,
        courseId?: number,
    ): CancelablePromise<UnitList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/organizations/{organization_id}/units',
            path: {
                'organization_id': organizationId,
            },
            query: {
                'courseId': courseId,
            },
        });
    }

    /**
     * Create a Unit
     * Returns organization's created unit
     * @param organizationId Organization Id
     * @param requestBody Request body to create unit
     * @returns Unit Organization Unit
     * @throws ApiError
     */
    public static quantuAppWebControllerUserUnitCreate(
        organizationId: number,
        requestBody: UnitCreate,
    ): CancelablePromise<Unit> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/organizations/{organization_id}/units',
            path: {
                'organization_id': organizationId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get a Unit's children
     * Returns organization's unit's children
     * @param id Unit Id
     * @returns UnitChildList Organization Unit
     * @throws ApiError
     */
    public static quantuAppWebControllerUnitChildren(
        id: number,
    ): CancelablePromise<UnitChildList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/units/{id}/children',
            path: {
                'id': id,
            },
        });
    }

}