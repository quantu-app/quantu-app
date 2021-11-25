/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * lesson show
 */
export type Lesson = {
    /**
     * Lesson content
     */
    content: Array<any>;
    /**
     * Lesson description
     */
    description: string;
    /**
     * Id
     */
    id: number;
    /**
     * Lesson index in unit
     */
    index?: number | null;
    /**
     * Creation timestamp
     */
    insertedAt: string;
    /**
     * Lesson name
     */
    name: string;
    /**
     * Organization Id
     */
    organizationId: number;
    /**
     * Lesson published status
     */
    published: boolean | null;
    /**
     * Lesson tags
     */
    tags: Array<string>;
    /**
     * Unit Id
     */
    unitId?: number | null;
    /**
     * Update timestamp
     */
    updatedAt: string;
}
