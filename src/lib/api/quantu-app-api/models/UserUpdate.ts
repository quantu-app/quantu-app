/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * A private user update
 */
export type UserUpdate = {
    /**
     * User active status
     */
    active: boolean;
    /**
     * User birthday
     */
    birthday: string | null;
    /**
     * User country
     */
    country: string | null;
    /**
     * User first name
     */
    firstName: string | null;
    /**
     * User last name
     */
    lastName: string | null;
    /**
     * User name
     */
    username: string;
}
