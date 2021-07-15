/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { User_Email } from './User_Email';

/**
 * A private user
 */
export type User_Private = {
    email?: User_Email;
    emails: Array<User_Email>;
    /**
     * Id
     */
    id: string;
    /**
     * Creation timestamp
     */
    insertedAt: string;
    /**
     * User Token
     */
    token?: string;
    /**
     * Update timestamp
     */
    updatedAt: string;
    /**
     * User name
     */
    username: string;
}
