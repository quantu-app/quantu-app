/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SignInUsernameOrEmailAndPassword } from '../models/SignInUsernameOrEmailAndPassword';
import type { SignUpUsernamePassword } from '../models/SignUpUsernamePassword';
import type { UserPrivate } from '../models/UserPrivate';
import { request as __request } from '../core/request';

export class AuthService {

    /**
     * Signs up a user and returns the User with the Bearer Token
     * @param requestBody Request body to sign up
     * @returns UserPrivate Sign up User Response
     * @throws ApiError
     */
    public static async quantuAppWebControllerAuthSignUpSignUp(
        requestBody: SignUpUsernamePassword,
    ): Promise<UserPrivate> {
        const result = await __request({
            method: 'POST',
            path: `/auth/sign-up`,
            body: requestBody,
            mediaType: 'application/json',
        });
        return result.body;
    }

    /**
     * Sign current User out
     * Signs out the current User based on the bearer token
     * @returns void
     * @throws ApiError
     */
    public static async quantuAppWebControllerAuthDelete(): Promise<void> {
        const result = await __request({
            method: 'DELETE',
            path: `/auth`,
        });
        return result.body;
    }

    /**
     * Gets the Current User
     * Returns the current user based on the bearer token
     * @returns UserPrivate Current User Response
     * @throws ApiError
     */
    public static async quantuAppWebControllerAuthCurrent(): Promise<UserPrivate> {
        const result = await __request({
            method: 'GET',
            path: `/auth`,
        });
        return result.body;
    }

    /**
     * Requests the providers context
     * Returns the providers context
     * @param provider Auth Provider
     * @returns void
     * @throws ApiError
     */
    public static async quantuAppWebControllerAuthRequest(
        provider: string,
    ): Promise<void> {
        const result = await __request({
            method: 'GET',
            path: `/auth/${provider}`,
        });
        return result.body;
    }

    /**
     * Signs in user and returns the User with the Bearer Token
     * @param requestBody Request body to sign in
     * @returns UserPrivate Sign in User Response
     * @throws ApiError
     */
    public static async quantuAppWebControllerAuthSignInSignIn(
        requestBody: SignInUsernameOrEmailAndPassword,
    ): Promise<UserPrivate> {
        const result = await __request({
            method: 'POST',
            path: `/auth/sign-in`,
            body: requestBody,
            mediaType: 'application/json',
        });
        return result.body;
    }

    /**
     * Signs in the Current User
     * Returns the current user
     * @param provider Auth Provider
     * @returns UserPrivate User Response
     * @throws ApiError
     */
    public static async quantuAppWebControllerAuthCallback(
        provider: string,
    ): Promise<UserPrivate> {
        const result = await __request({
            method: 'GET',
            path: `/auth/${provider}/callback`,
        });
        return result.body;
    }

}