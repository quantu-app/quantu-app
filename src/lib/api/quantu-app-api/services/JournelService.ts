/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Journel } from '../models/Journel';
import type { JournelCreate } from '../models/JournelCreate';
import type { JournelList } from '../models/JournelList';
import type { JournelUpdate } from '../models/JournelUpdate';
import { request as __request } from '../core/request';

export class JournelService {

    /**
     * List Journels
     * Returns user's journels
     *
     * @returns JournelList User Journels
     * @throws ApiError
     */
    public static async quantuAppWebControllerJournelIndex(): Promise<JournelList> {
        const result = await __request({
            method: 'GET',
            path: `/journels`,
        });
        return result.body;
    }

    /**
     * Create a Journel
     * Returns user's created journel
     *
     * @param requestBody Request body to create journel
     * @returns Journel User Journel
     * @throws ApiError
     */
    public static async quantuAppWebControllerJournelCreate(
        requestBody: JournelCreate,
    ): Promise<Journel> {
        const result = await __request({
            method: 'POST',
            path: `/journels`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Delete a Journel
     * Returns nothing
     *
     * @param id Journel Id
     * @returns void
     * @throws ApiError
     */
    public static async quantuAppWebControllerJournelDelete(
        id: string,
    ): Promise<void> {
        const result = await __request({
            method: 'DELETE',
            path: `/journels/${id}`,
        });
        return result.body;
    }

    /**
     * Get a Journel
     * Returns user's journel
     *
     * @param id Journel Id
     * @returns Journel User Journel
     * @throws ApiError
     */
    public static async quantuAppWebControllerJournelShow(
        id: string,
    ): Promise<Journel> {
        const result = await __request({
            method: 'GET',
            path: `/journels/${id}`,
        });
        return result.body;
    }

    /**
     * Updates a Journel
     * Returns user's updated journel
     *
     * @param id Journel Id
     * @param requestBody Request body to update journel
     * @returns Journel User Journel
     * @throws ApiError
     */
    public static async quantuAppWebControllerJournelUpdate(
        id: string,
        requestBody: JournelUpdate,
    ): Promise<Journel> {
        const result = await __request({
            method: 'PATCH',
            path: `/journels/${id}`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Updates a Journel
     * Returns user's updated journel
     *
     * @param id Journel Id
     * @param requestBody Request body to update journel
     * @returns Journel User Journel
     * @throws ApiError
     */
    public static async quantuAppWebControllerJournelUpdate2(
        id: string,
        requestBody: JournelUpdate,
    ): Promise<Journel> {
        const result = await __request({
            method: 'PUT',
            path: `/journels/${id}`,
            body: requestBody,
        });
        return result.body;
    }

}