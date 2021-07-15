/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Document_Create } from '../models/Document_Create';
import type { Document_List } from '../models/Document_List';
import type { Document_Show } from '../models/Document_Show';
import type { Document_Update } from '../models/Document_Update';
import { request as __request } from '../core/request';

export class DocumentService {

    /**
     * List Documents
     * Returns user's documents
     *
     * @returns Document_List User Documents
     * @throws ApiError
     */
    public static async quantuAppWebControllerDocumentIndex(): Promise<Document_List> {
        const result = await __request({
            method: 'GET',
            path: `/documents`,
        });
        return result.body;
    }

    /**
     * Create a Document
     * Returns user's created document
     *
     * @param requestBody Request body to create document
     * @returns Document_Show User Document
     * @throws ApiError
     */
    public static async quantuAppWebControllerDocumentCreate(
        requestBody: Document_Create,
    ): Promise<Document_Show> {
        const result = await __request({
            method: 'POST',
            path: `/documents`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Get a Document
     * Returns user's document
     *
     * @param id Document Id
     * @returns Document_Show User Document
     * @throws ApiError
     */
    public static async quantuAppWebControllerDocumentShow(
        id: string,
    ): Promise<Document_Show> {
        const result = await __request({
            method: 'GET',
            path: `/documents/${id}`,
        });
        return result.body;
    }

    /**
     * Updates a Document
     * Returns user's updated document
     *
     * @param id Document Id
     * @param requestBody Request body to update document
     * @returns Document_Show User Document
     * @throws ApiError
     */
    public static async quantuAppWebControllerDocumentUpdate(
        id: string,
        requestBody: Document_Update,
    ): Promise<Document_Show> {
        const result = await __request({
            method: 'PATCH',
            path: `/documents/${id}`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Updates a Document
     * Returns user's updated document
     *
     * @param id Document Id
     * @param requestBody Request body to update document
     * @returns Document_Show User Document
     * @throws ApiError
     */
    public static async quantuAppWebControllerDocumentUpdate2(
        id: string,
        requestBody: Document_Update,
    ): Promise<Document_Show> {
        const result = await __request({
            method: 'PUT',
            path: `/documents/${id}`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Uploads a Document's document
     * Returns user's updated document
     *
     * @param id Document Id
     * @param requestBody Request body to update document
     * @returns Document_Show User Document
     * @throws ApiError
     */
    public static async quantuAppWebControllerDocumentUpload(
        id: string,
        requestBody: Document_Update,
    ): Promise<Document_Show> {
        const result = await __request({
            method: 'POST',
            path: `/documents/${id}/upload`,
            body: requestBody,
        });
        return result.body;
    }

}