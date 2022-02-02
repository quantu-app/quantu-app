/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Organization } from '../models/Organization';
import type { OrganizationCreate } from '../models/OrganizationCreate';
import type { OrganizationList } from '../models/OrganizationList';
import type { OrganizationUpdate } from '../models/OrganizationUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class OrganizationService {

    /**
     * Get a Organization
     * Returns an organization
     * @param id Organization Id
     * @returns Organization User Organization
     * @throws ApiError
     */
    public static quantuAppWebControllerOrganizationShow(
        id: number,
    ): CancelablePromise<Organization> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/organizations/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * List Organizations
     * Returns all organizations
     * @param subscriptions Only user's subscriptions
     * @returns OrganizationList User Organizations
     * @throws ApiError
     */
    public static quantuAppWebControllerOrganizationIndex(
        subscriptions?: boolean,
    ): CancelablePromise<OrganizationList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/organizations',
            query: {
                'subscriptions': subscriptions,
            },
        });
    }

    /**
     * Get a Organization by url
     * Returns an organization by url
     * @param url Organization's url
     * @returns Organization User Organization
     * @throws ApiError
     */
    public static quantuAppWebControllerOrganizationShowByUrl(
        url: string,
    ): CancelablePromise<Organization> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/organization/{url}',
            path: {
                'url': url,
            },
        });
    }

    /**
     * List Organizations
     * Returns user's organizations
     * @returns OrganizationList User Organizations
     * @throws ApiError
     */
    public static quantuAppWebControllerUserOrganizationIndex(): CancelablePromise<OrganizationList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/organizations',
        });
    }

    /**
     * Create a Organization
     * Returns user's created organization
     * @param requestBody Request body to create organization
     * @returns Organization User Organization
     * @throws ApiError
     */
    public static quantuAppWebControllerUserOrganizationCreate(
        requestBody: OrganizationCreate,
    ): CancelablePromise<Organization> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/organizations',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Delete a Organization
     * Returns nothing
     * @param id Organization Id
     * @returns void
     * @throws ApiError
     */
    public static quantuAppWebControllerUserOrganizationDelete(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/user/organizations/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Get a Organization
     * Returns user's organization
     * @param id Organization Id
     * @returns Organization User Organization
     * @throws ApiError
     */
    public static quantuAppWebControllerUserOrganizationShow(
        id: number,
    ): CancelablePromise<Organization> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/organizations/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * Updates a Organization
     * Returns user's updated organization
     * @param id Organization Id
     * @param requestBody Request body to update organization
     * @returns Organization User Organization
     * @throws ApiError
     */
    public static quantuAppWebControllerUserOrganizationUpdate(
        id: number,
        requestBody: OrganizationUpdate,
    ): CancelablePromise<Organization> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/user/organizations/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Updates a Organization
     * Returns user's updated organization
     * @param id Organization Id
     * @param requestBody Request body to update organization
     * @returns Organization User Organization
     * @throws ApiError
     */
    public static quantuAppWebControllerUserOrganizationUpdate2(
        id: number,
        requestBody: OrganizationUpdate,
    ): CancelablePromise<Organization> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/user/organizations/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}