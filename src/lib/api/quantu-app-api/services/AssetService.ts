/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AssetFile } from '../models/AssetFile';
import { request as __request } from '../core/request';

export class AssetService {

    /**
     * Get an Asset
     * Returns organization's asset
     * @param id Asset Id
     * @param parentId Asset Parent Id
     * @param organizationId Asset Organization Id
     * @returns AssetFile Organization Asset
     * @throws ApiError
     */
    public static async quantuAppWebControllerAssetShowByParent(
        id: number,
        parentId: number,
        organizationId: number,
    ): Promise<AssetFile> {
        const result = await __request({
            method: 'GET',
            path: `/static/assets/${organizationId}/${parentId}/${id}`,
        });
        return result.body;
    }

    /**
     * Get an Asset
     * Returns organization's asset
     * @param id Asset Id
     * @param organizationId Asset Organization Id
     * @returns AssetFile Organization Asset
     * @throws ApiError
     */
    public static async quantuAppWebControllerAssetShowByOrganization(
        id: number,
        organizationId: number,
    ): Promise<AssetFile> {
        const result = await __request({
            method: 'GET',
            path: `/static/assets/${organizationId}/${id}`,
        });
        return result.body;
    }

}