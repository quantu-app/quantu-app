/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Email } from './Email';

/**
 * A private user
 */
export type User = {
    /**
     * User creator status
     */
    creator?: boolean | null;
    email?: Email;
    emails: Array<Email>;
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
    token: string;
    /**
     * Update timestamp
     */
    updatedAt: string;
    /**
     * User name
     */
    username: string;
}
