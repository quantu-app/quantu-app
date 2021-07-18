/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * journal show
 */
export type Journal = {
    /**
     * Journal content
     */
    content: Array<any>;
    /**
     * Id
     */
    id: string;
    /**
     * Creation timestamp
     */
    insertedAt: string;
    /**
     * Journal language
     */
    language: string;
    /**
     * Journal location
     */
    location: string;
    /**
     * Journal name
     */
    name: string;
    /**
     * Journal tags
     */
    tags: Array<string>;
    /**
     * Update timestamp
     */
    updatedAt: string;
    /**
     * User Id
     */
    userId: string;
    /**
     * Journal word count
     */
    wordCount: number;
}
