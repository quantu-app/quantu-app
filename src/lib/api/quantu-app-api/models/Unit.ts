/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * unit show
 */
export type Unit = {
    /**
     * Unit Course Id
     */
    courseId?: number | null;
    /**
     * Unit description
     */
    description: Array<any>;
    /**
     * Id
     */
    id: number;
    /**
     * Unit index in unit
     */
    index?: number | null;
    /**
     * Creation timestamp
     */
    insertedAt: string;
    /**
     * Unit name
     */
    name: string;
    /**
     * Organization Id
     */
    organizationId: number;
    /**
     * Unit published status
     */
    published: boolean | null;
    /**
     * Unit tags
     */
    tags: Array<string>;
    /**
     * Update timestamp
     */
    updatedAt: string;
};
