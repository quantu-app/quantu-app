/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * asset create
 */
export type AssetCreate = {
    /**
     * Asset file name
     */
    name?: Blob;
    /**
     * Asset parent id
     */
    parentId?: number | null;
    /**
     * Asset type
     */
    type?: string | null;
}
