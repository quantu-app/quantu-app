/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Organization } from '../models/Organization';
import type { OrganizationList } from '../models/OrganizationList';
import { request as __request } from '../core/request';

export class OrganizationService {

    /**
     * Get a Organization by url
     * Returns an organization by url
     * @param url Organization's url
     * @returns Organization User Organization
     * @throws ApiError
     */
    public static async quantuAppWebControllerOrganizationShowByUrl(
        url: string,
    ): Promise<Organization> {
        const result = await __request({
            method: 'GET',
            path: `/organization/${url}`,
        });
        return result.body;
    }

    /**
     * List Organizations
     * Returns all organizations
     * @returns OrganizationList User Organizations
     * @throws ApiError
     */
    public static async quantuAppWebControllerOrganizationIndex(): Promise<OrganizationList> {
        const result = await __request({
            method: 'GET',
            path: `/organizations`,
        });
        return result.body;
    }

    /**
     * Get a Organization
     * Returns an organization
     * @param id Organization Id
     * @returns Organization User Organization
     * @throws ApiError
     */
    public static async quantuAppWebControllerOrganizationShow(
        id: number,
    ): Promise<Organization> {
        const result = await __request({
            method: 'GET',
            path: `/organizations/${id}`,
        });
        return result.body;
    }

}