/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Asset } from '../models/Asset';
import type { AssetCreate } from '../models/AssetCreate';
import type { AssetFile } from '../models/AssetFile';
import type { AssetList } from '../models/AssetList';
import type { AssetUpdate } from '../models/AssetUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { request as __request } from '../core/request';

export class AssetService {

    /**
     * List Assets
     * Returns organization's assets
     * @param organizationId Organization Id
     * @param parentId Parent Id
     * @returns AssetList Organization Assetzes
     * @throws ApiError
     */
    public static quantuAppWebControllerUserAssetIndex(
        organizationId: number,
        parentId?: number,
    ): CancelablePromise<AssetList> {
        return __request({
            method: 'GET',
            path: `/user/organizations/${organizationId}/assets`,
            query: {
                'parentId': parentId,
            },
        });
    }

    /**
     * Create a Asset
     * Returns organization's created asset
     * @param organizationId Organization Id
     * @param formData Request body to create asset
     * @returns Asset Organization Asset
     * @throws ApiError
     */
    public static quantuAppWebControllerUserAssetCreate(
        organizationId: number,
        formData: AssetCreate,
    ): CancelablePromise<Asset> {
        return __request({
            method: 'POST',
            path: `/user/organizations/${organizationId}/assets`,
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }

    /**
     * Get an Asset
     * Returns organization's asset
     * @param id Asset Id
     * @param parentId Asset Parent Id
     * @param organizationId Asset Organization Id
     * @returns AssetFile Organization Asset
     * @throws ApiError
     */
    public static quantuAppWebControllerAssetShowByParent(
        id: number,
        parentId: number,
        organizationId: number,
    ): CancelablePromise<AssetFile> {
        return __request({
            method: 'GET',
            path: `/static/assets/${organizationId}/${parentId}/${id}`,
        });
    }

    /**
     * Get an Asset
     * Returns organization's asset
     * @param id Asset Id
     * @param organizationId Asset Organization Id
     * @returns AssetFile Organization Asset
     * @throws ApiError
     */
    public static quantuAppWebControllerAssetShowByOrganization(
        id: number,
        organizationId: number,
    ): CancelablePromise<AssetFile> {
        return __request({
            method: 'GET',
            path: `/static/assets/${organizationId}/${id}`,
        });
    }

    /**
     * Delete a Asset
     * Returns nothing
     * @param id Asset Id
     * @param organizationId Organization Id
     * @returns void
     * @throws ApiError
     */
    public static quantuAppWebControllerUserAssetDelete(
        id: number,
        organizationId: number,
    ): CancelablePromise<void> {
        return __request({
            method: 'DELETE',
            path: `/user/organizations/${organizationId}/assets/${id}`,
        });
    }

    /**
     * Get a Asset
     * Returns organization's asset
     * @param id Asset Id
     * @param organizationId Organization Id
     * @param parentId Parent Id
     * @returns Asset Organization Asset
     * @throws ApiError
     */
    public static quantuAppWebControllerUserAssetShow(
        id: number,
        organizationId: number,
        parentId?: number,
    ): CancelablePromise<Asset> {
        return __request({
            method: 'GET',
            path: `/user/organizations/${organizationId}/assets/${id}`,
            query: {
                'parentId': parentId,
            },
        });
    }

    /**
     * Updates a Asset
     * Returns organization's updated asset
     * @param id Asset Id
     * @param organizationId Organization Id
     * @param formData Request body to update asset
     * @returns Asset Organization Asset
     * @throws ApiError
     */
    public static quantuAppWebControllerUserAssetUpdate(
        id: number,
        organizationId: number,
        formData: AssetUpdate,
    ): CancelablePromise<Asset> {
        return __request({
            method: 'PATCH',
            path: `/user/organizations/${organizationId}/assets/${id}`,
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }

    /**
     * Updates a Asset
     * Returns organization's updated asset
     * @param id Asset Id
     * @param organizationId Organization Id
     * @param formData Request body to update asset
     * @returns Asset Organization Asset
     * @throws ApiError
     */
    public static quantuAppWebControllerUserAssetUpdate2(
        id: number,
        organizationId: number,
        formData: AssetUpdate,
    ): CancelablePromise<Asset> {
        return __request({
            method: 'PUT',
            path: `/user/organizations/${organizationId}/assets/${id}`,
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }

}