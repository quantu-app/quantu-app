/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Email } from '../models/Email';
import type { EmailCreate } from '../models/EmailCreate';
import type { PasswordReset } from '../models/PasswordReset';
import type { User } from '../models/User';
import type { UsernameUpdate } from '../models/UsernameUpdate';
import { request as __request } from '../core/request';

export class UserService {

    /**
     * Create an Eamil
     * Create and returns an Email
     *
     * @param requestBody Create Email Body
     * @returns Email Create an Email Response
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserEmailCreate(
        requestBody: EmailCreate,
    ): Promise<Email> {
        const result = await __request({
            method: 'POST',
            path: `/user/email`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Confirm an Eamil
     * Confirms an Email and returns the User with the Bearer Token
     *
     * @param confirmationToken Confirmation Token
     * @returns User Confirmed User Email Response
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserEmailConfirm(
        confirmationToken?: string,
    ): Promise<User> {
        const result = await __request({
            method: 'PATCH',
            path: `/user/email/confirm`,
            query: {
                'confirmation_token': confirmationToken,
            },
        });
        return result.body;
    }

    /**
     * Confirm an Eamil
     * Confirms an Email and returns the User with the Bearer Token
     *
     * @param confirmationToken Confirmation Token
     * @returns User Confirmed User Email Response
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserEmailConfirm2(
        confirmationToken?: string,
    ): Promise<User> {
        const result = await __request({
            method: 'PUT',
            path: `/user/email/confirm`,
            query: {
                'confirmation_token': confirmationToken,
            },
        });
        return result.body;
    }

    /**
     * Delete an Email
     * Delete a non-primary Email
     *
     * @param id Email Id
     * @returns Email Delete non-primary Email Response
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserEmailDelete(
        id: number,
    ): Promise<Email> {
        const result = await __request({
            method: 'DELETE',
            path: `/user/email/${id}`,
        });
        return result.body;
    }

    /**
     * Set Email as Primary
     * Sets an Email as User's Primary Email
     *
     * @param id Email Id
     * @returns Email Set Primary Email Response
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserEmailSetPrimary(
        id: number,
    ): Promise<Email> {
        const result = await __request({
            method: 'PATCH',
            path: `/user/email/${id}/primary`,
        });
        return result.body;
    }

    /**
     * Set Email as Primary
     * Sets an Email as User's Primary Email
     *
     * @param id Email Id
     * @returns Email Set Primary Email Response
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserEmailSetPrimary2(
        id: number,
    ): Promise<Email> {
        const result = await __request({
            method: 'PUT',
            path: `/user/email/${id}/primary`,
        });
        return result.body;
    }

    /**
     * Reset Password
     * Resets the User's Password creating a new Token in the process
     *
     * @param requestBody reset user password
     * @returns User Confirmed User Email Response
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserPasswordReset(
        requestBody: PasswordReset,
    ): Promise<User> {
        const result = await __request({
            method: 'PATCH',
            path: `/user/password/reset`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Reset Password
     * Resets the User's Password creating a new Token in the process
     *
     * @param requestBody reset user password
     * @returns User Confirmed User Email Response
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserPasswordReset2(
        requestBody: PasswordReset,
    ): Promise<User> {
        const result = await __request({
            method: 'PUT',
            path: `/user/password/reset`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Update User's Username
     * Updates a User's Username
     *
     * @param requestBody Update User's Username Body
     * @returns User Update User's Username Response
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserUsernameUpdate(
        requestBody: UsernameUpdate,
    ): Promise<User> {
        const result = await __request({
            method: 'PATCH',
            path: `/user/username`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Update User's Username
     * Updates a User's Username
     *
     * @param requestBody Update User's Username Body
     * @returns User Update User's Username Response
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserUsernameUpdate2(
        requestBody: UsernameUpdate,
    ): Promise<User> {
        const result = await __request({
            method: 'PUT',
            path: `/user/username`,
            body: requestBody,
        });
        return result.body;
    }

}