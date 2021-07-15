/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * document create
 */
export type Document_Create = {
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
     * Document word count
     */
    wordCount: number;
}
