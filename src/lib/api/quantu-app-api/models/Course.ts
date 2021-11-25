/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * course show
 */
export type Course = {
    /**
     * Course description
     */
    description: string;
    /**
     * Id
     */
    id: number;
    /**
     * Creation timestamp
     */
    insertedAt: string;
    /**
     * Course name
     */
    name: string;
    /**
     * Organization Id
     */
    organizationId: number;
    /**
     * Course published status
     */
    published: boolean | null;
    /**
     * Course tags
     */
    tags: Array<string>;
    /**
     * Update timestamp
     */
    updatedAt: string;
}
