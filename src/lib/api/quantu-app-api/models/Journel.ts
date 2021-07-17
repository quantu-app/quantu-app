/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * journel show
 */
export type Journel = {
    /**
     * Journel content
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
     * Journel language
     */
    language: string;
    /**
     * Journel location
     */
    location: string;
    /**
     * Journel name
     */
    name: string;
    /**
     * Journel tags
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
     * Journel word count
     */
    wordCount: number;
}
