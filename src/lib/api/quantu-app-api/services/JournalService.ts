/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Journal } from '../models/Journal';
import type { JournalCreate } from '../models/JournalCreate';
import type { JournalList } from '../models/JournalList';
import type { JournalUpdate } from '../models/JournalUpdate';
import { request as __request } from '../core/request';

export class JournalService {

    /**
     * List Journals
     * Returns user's journals
     *
     * @returns JournalList User Journals
     * @throws ApiError
     */
    public static async quantuAppWebControllerJournalIndex(): Promise<JournalList> {
        const result = await __request({
            method: 'GET',
            path: `/journals`,
        });
        return result.body;
    }

    /**
     * Create a Journal
     * Returns user's created journal
     *
     * @param requestBody Request body to create journal
     * @returns Journal User Journal
     * @throws ApiError
     */
    public static async quantuAppWebControllerJournalCreate(
        requestBody: JournalCreate,
    ): Promise<Journal> {
        const result = await __request({
            method: 'POST',
            path: `/journals`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Delete a Journal
     * Returns nothing
     *
     * @param id Journal Id
     * @returns void
     * @throws ApiError
     */
    public static async quantuAppWebControllerJournalDelete(
        id: string,
    ): Promise<void> {
        const result = await __request({
            method: 'DELETE',
            path: `/journals/${id}`,
        });
        return result.body;
    }

    /**
     * Get a Journal
     * Returns user's journal
     *
     * @param id Journal Id
     * @returns Journal User Journal
     * @throws ApiError
     */
    public static async quantuAppWebControllerJournalShow(
        id: string,
    ): Promise<Journal> {
        const result = await __request({
            method: 'GET',
            path: `/journals/${id}`,
        });
        return result.body;
    }

    /**
     * Updates a Journal
     * Returns user's updated journal
     *
     * @param id Journal Id
     * @param requestBody Request body to update journal
     * @returns Journal User Journal
     * @throws ApiError
     */
    public static async quantuAppWebControllerJournalUpdate(
        id: string,
        requestBody: JournalUpdate,
    ): Promise<Journal> {
        const result = await __request({
            method: 'PATCH',
            path: `/journals/${id}`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Updates a Journal
     * Returns user's updated journal
     *
     * @param id Journal Id
     * @param requestBody Request body to update journal
     * @returns Journal User Journal
     * @throws ApiError
     */
    public static async quantuAppWebControllerJournalUpdate2(
        id: string,
        requestBody: JournalUpdate,
    ): Promise<Journal> {
        const result = await __request({
            method: 'PUT',
            path: `/journals/${id}`,
            body: requestBody,
        });
        return result.body;
    }

}