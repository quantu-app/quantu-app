/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { User_Email } from '../models/User_Email';
import type { User_EmailCreate } from '../models/User_EmailCreate';
import type { User_Private } from '../models/User_Private';
import type { User_UsernameUpdate } from '../models/User_UsernameUpdate';
import { request as __request } from '../core/request';

export class UserService {

    /**
     * Create an Eamil
     * Create and returns an Email
     *
     * @param requestBody Create Email Body
     * @returns User_Email Create an Email Response
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserEmailCreate(
        requestBody: User_EmailCreate,
    ): Promise<User_Email> {
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
     * @returns User_Private Confirmed User Email Response
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserEmailConfirm(
        confirmationToken?: string,
    ): Promise<User_Private> {
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
     * @returns User_Private Confirmed User Email Response
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserEmailConfirm2(
        confirmationToken?: string,
    ): Promise<User_Private> {
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
     * @returns User_Email Delete non-primary Email Response
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserEmailDelete(
        id: number,
    ): Promise<User_Email> {
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
     * @returns User_Email Set Primary Email Response
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserEmailSetPrimary(
        id: number,
    ): Promise<User_Email> {
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
     * @returns User_Email Set Primary Email Response
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserEmailSetPrimary2(
        id: number,
    ): Promise<User_Email> {
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
     * @returns User_Private Confirmed User Email Response
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserPasswordReset(
        requestBody: User_EmailCreate,
    ): Promise<User_Private> {
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
     * @returns User_Private Confirmed User Email Response
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserPasswordReset2(
        requestBody: User_EmailCreate,
    ): Promise<User_Private> {
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
     * @returns User_Private Update User's Username Response
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserUsernameUpdate(
        requestBody: User_UsernameUpdate,
    ): Promise<User_Private> {
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
     * @returns User_Private Update User's Username Response
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserUsernameUpdate2(
        requestBody: User_UsernameUpdate,
    ): Promise<User_Private> {
        const result = await __request({
            method: 'PUT',
            path: `/user/username`,
            body: requestBody,
        });
        return result.body;
    }

}