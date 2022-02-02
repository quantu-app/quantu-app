/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * asset show
 */
export type Asset = {
    /**
     * Id
     */
    id: number;
    /**
     * Creation timestamp
     */
    insertedAt: string;
    /**
     * Asset name
     */
    name: string;
    /**
     * Organization Id
     */
    organizationId: number;
    /**
     * Asset parent id
     */
    parentId: number | null;
    /**
     * Asset type
     */
    type: string;
    /**
     * Update timestamp
     */
    updatedAt: string;
    /**
     * Asset url
     */
    url: string;
};
