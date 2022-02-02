/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Asset } from '../models/Asset';
import type { AssetCreate } from '../models/AssetCreate';
import type { AssetFile } from '../models/AssetFile';
import type { AssetList } from '../models/AssetList';
import type { AssetUpdate } from '../models/AssetUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
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
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/organizations/{organization_id}/assets',
            path: {
                'organization_id': organizationId,
            },
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
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/organizations/{organization_id}/assets',
            path: {
                'organization_id': organizationId,
            },
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
        return __request(OpenAPI, {
            method: 'GET',
            url: '/static/assets/{organization_id}/{parent_id}/{id}',
            path: {
                'id': id,
                'parent_id': parentId,
                'organization_id': organizationId,
            },
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
        return __request(OpenAPI, {
            method: 'GET',
            url: '/static/assets/{organization_id}/{id}',
            path: {
                'id': id,
                'organization_id': organizationId,
            },
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
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/user/organizations/{organization_id}/assets/{id}',
            path: {
                'id': id,
                'organization_id': organizationId,
            },
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
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/organizations/{organization_id}/assets/{id}',
            path: {
                'id': id,
                'organization_id': organizationId,
            },
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
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/user/organizations/{organization_id}/assets/{id}',
            path: {
                'id': id,
                'organization_id': organizationId,
            },
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
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/user/organizations/{organization_id}/assets/{id}',
            path: {
                'id': id,
                'organization_id': organizationId,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }

}