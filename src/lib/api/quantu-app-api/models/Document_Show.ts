/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * document show
 */
export type Document_Show = {
    /**
     * Document content hash
     */
    contentHash: string;
    /**
     * Id
     */
    id: string;
    /**
     * Creation timestamp
     */
    insertedAt: string;
    /**
     * Document langauge
     */
    language: string;
    /**
     * Document name
     */
    name: string;
    /**
     * Document tags
     */
    tags: Array<string>;
    /**
     * Document type
     */
    type: string;
    /**
     * Update timestamp
     */
    updatedAt: string;
    /**
     * Document url
     */
    url: string;
    /**
     * User Id
     */
    userId: string;
    /**
     * Document word count
     */
    wordCount: number;
}
