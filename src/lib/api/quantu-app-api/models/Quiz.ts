/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * quiz show
 */
export type Quiz = {
    /**
     * Quiz description
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
     * Quiz name
     */
    name: string;
    /**
     * Organization Id
     */
    organizationId: number;
    /**
     * Quiz published status
     */
    published: boolean | null;
    /**
     * Quiz tags
     */
    tags: Array<string>;
    /**
     * Update timestamp
     */
    updatedAt: string;
}
