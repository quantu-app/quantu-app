/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Organization } from '../models/Organization';
import type { OrganizationCreate } from '../models/OrganizationCreate';
import type { OrganizationList } from '../models/OrganizationList';
import type { OrganizationUpdate } from '../models/OrganizationUpdate';
import { request as __request } from '../core/request';

export class OrganizationService {

    /**
     * Get a Organization by url
     * Returns user's organization
     *
     * @param url Organization's url
     * @returns Organization User Organization
     * @throws ApiError
     */
    public static async quantuAppWebControllerOrganizationShowByUrl(
        url: string,
    ): Promise<Organization> {
        const result = await __request({
            method: 'GET',
            path: `/user/organizations/${url}`,
        });
        return result.body;
    }

    /**
     * List Organizations
     * Returns user's organizations
     *
     * @returns OrganizationList User Organizations
     * @throws ApiError
     */
    public static async quantuAppWebControllerOrganizationIndex(): Promise<OrganizationList> {
        const result = await __request({
            method: 'GET',
            path: `/user/organizations`,
        });
        return result.body;
    }

    /**
     * Create a Organization
     * Returns user's created organization
     *
     * @param requestBody Request body to create organization
     * @returns Organization User Organization
     * @throws ApiError
     */
    public static async quantuAppWebControllerOrganizationCreate(
        requestBody: OrganizationCreate,
    ): Promise<Organization> {
        const result = await __request({
            method: 'POST',
            path: `/user/organizations`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Delete a Organization
     * Returns nothing
     *
     * @param id Organization Id
     * @returns void
     * @throws ApiError
     */
    public static async quantuAppWebControllerOrganizationDelete(
        id: string,
    ): Promise<void> {
        const result = await __request({
            method: 'DELETE',
            path: `/user/organizations/${id}`,
        });
        return result.body;
    }

    /**
     * Get a Organization
     * Returns user's organization
     *
     * @param id Organization Id
     * @returns Organization User Organization
     * @throws ApiError
     */
    public static async quantuAppWebControllerOrganizationShow(
        id: string,
    ): Promise<Organization> {
        const result = await __request({
            method: 'GET',
            path: `/user/organizations/${id}`,
        });
        return result.body;
    }

    /**
     * Updates a Organization
     * Returns user's updated organization
     *
     * @param id Organization Id
     * @param requestBody Request body to update organization
     * @returns Organization User Organization
     * @throws ApiError
     */
    public static async quantuAppWebControllerOrganizationUpdate(
        id: string,
        requestBody: OrganizationUpdate,
    ): Promise<Organization> {
        const result = await __request({
            method: 'PATCH',
            path: `/user/organizations/${id}`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Updates a Organization
     * Returns user's updated organization
     *
     * @param id Organization Id
     * @param requestBody Request body to update organization
     * @returns Organization User Organization
     * @throws ApiError
     */
    public static async quantuAppWebControllerOrganizationUpdate2(
        id: string,
        requestBody: OrganizationUpdate,
    ): Promise<Organization> {
        const result = await __request({
            method: 'PUT',
            path: `/user/organizations/${id}`,
            body: requestBody,
        });
        return result.body;
    }

}