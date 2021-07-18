/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * journal update
 */
export type JournalUpdate = {
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
    name?: string;
    /**
     * Journal tags
     */
    tags?: Array<string>;
    /**
     * Journal word count
     */
    wordCount?: number;
}
