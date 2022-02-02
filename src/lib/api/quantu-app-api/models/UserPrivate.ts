/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Email } from './Email';

/**
 * A private user
 */
export type UserPrivate = {
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
     * User creator status
     */
    creator: boolean | null;
    email?: Email;
    emails: Array<Email>;
    /**
     * User first name
     */
    firstName: string | null;
    /**
     * Id
     */
    id: string;
    /**
     * Creation timestamp
     */
    insertedAt: string;
    /**
     * User last name
     */
    lastName: string | null;
    /**
     * User Token
     */
    token: string;
    /**
     * Update timestamp
     */
    updatedAt: string;
    /**
     * User name
     */
    username: string;
};
