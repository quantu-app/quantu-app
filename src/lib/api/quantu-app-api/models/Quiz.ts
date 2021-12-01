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
    description: Array<any>;
    /**
     * Id
     */
    id: number;
    /**
     * Quiz index in unit
     */
    index?: number | null;
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
     * Quiz type
     */
    type?: Quiz.type | null;
    /**
     * Unit Id
     */
    unitId?: number | null;
    /**
     * Update timestamp
     */
    updatedAt: string;
}

export namespace Quiz {

    /**
     * Quiz type
     */
    export enum type {
        QUIZ = 'quiz',
    }


}
