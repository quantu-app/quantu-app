/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * journel create
 */
export type JournelCreate = {
    /**
     * Journel content
     */
    content?: Array<any>;
    /**
     * Journel language
     */
    language?: string;
    /**
     * Journel location
     */
    location?: string;
    /**
     * Journel name
     */
    name: string;
    /**
     * Journel tags
     */
    tags?: Array<string>;
    /**
     * Journel word count
     */
    wordCount?: number;
}
