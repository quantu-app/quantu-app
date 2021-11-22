/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Organization } from '../models/Organization';
import type { OrganizationCreate } from '../models/OrganizationCreate';
import type { OrganizationList } from '../models/OrganizationList';
import type { OrganizationUpdate } from '../models/OrganizationUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
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
        return __request({
            method: 'GET',
            path: `/organizations/${id}`,
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
        return __request({
            method: 'GET',
            path: `/organizations`,
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
        return __request({
            method: 'GET',
            path: `/organization/${url}`,
        });
    }

    /**
     * List Organizations
     * Returns user's organizations
     * @returns OrganizationList User Organizations
     * @throws ApiError
     */
    public static quantuAppWebControllerUserOrganizationIndex(): CancelablePromise<OrganizationList> {
        return __request({
            method: 'GET',
            path: `/user/organizations`,
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
        return __request({
            method: 'POST',
            path: `/user/organizations`,
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
        return __request({
            method: 'DELETE',
            path: `/user/organizations/${id}`,
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
        return __request({
            method: 'GET',
            path: `/user/organizations/${id}`,
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
        return __request({
            method: 'PATCH',
            path: `/user/organizations/${id}`,
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
        return __request({
            method: 'PUT',
            path: `/user/organizations/${id}`,
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}