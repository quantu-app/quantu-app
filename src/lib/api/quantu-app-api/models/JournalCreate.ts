/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * journal create
 */
export type JournalCreate = {
    /**
     * Journal content
     */
    content?: Array<any>;
    /**
     * Journal language
     */
    language?: string;
    /**
     * Journal location
     */
    location?: string;
    /**
     * Journal name
     */
    name: string;
    /**
     * Journal tags
     */
    tags?: Array<string>;
    /**
     * Journal word count
     */
    wordCount?: number;
}
