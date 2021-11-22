/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SignInUsernameOrEmailAndPassword } from '../models/SignInUsernameOrEmailAndPassword';
import type { SignUpUsernamePassword } from '../models/SignUpUsernamePassword';
import type { UserPrivate } from '../models/UserPrivate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { request as __request } from '../core/request';

export class AuthService {

    /**
     * Signs up a user and returns the User with the Bearer Token
     * @param requestBody Request body to sign up
     * @returns UserPrivate Sign up User Response
     * @throws ApiError
     */
    public static quantuAppWebControllerAuthSignUpSignUp(
        requestBody: SignUpUsernamePassword,
    ): CancelablePromise<UserPrivate> {
        return __request({
            method: 'POST',
            path: `/auth/sign-up`,
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Sign current User out
     * Signs out the current User based on the bearer token
     * @returns void
     * @throws ApiError
     */
    public static quantuAppWebControllerAuthDelete(): CancelablePromise<void> {
        return __request({
            method: 'DELETE',
            path: `/auth`,
        });
    }

    /**
     * Gets the Current User
     * Returns the current user based on the bearer token
     * @returns UserPrivate Current User Response
     * @throws ApiError
     */
    public static quantuAppWebControllerAuthCurrent(): CancelablePromise<UserPrivate> {
        return __request({
            method: 'GET',
            path: `/auth`,
        });
    }

    /**
     * Requests the providers context
     * Returns the providers context
     * @param provider Auth Provider
     * @returns void
     * @throws ApiError
     */
    public static quantuAppWebControllerAuthRequest(
        provider: string,
    ): CancelablePromise<void> {
        return __request({
            method: 'GET',
            path: `/auth/${provider}`,
        });
    }

    /**
     * Signs in user and returns the User with the Bearer Token
     * @param requestBody Request body to sign in
     * @returns UserPrivate Sign in User Response
     * @throws ApiError
     */
    public static quantuAppWebControllerAuthSignInSignIn(
        requestBody: SignInUsernameOrEmailAndPassword,
    ): CancelablePromise<UserPrivate> {
        return __request({
            method: 'POST',
            path: `/auth/sign-in`,
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Signs in the Current User
     * Returns the current user
     * @param provider Auth Provider
     * @returns UserPrivate User Response
     * @throws ApiError
     */
    public static quantuAppWebControllerAuthCallback(
        provider: string,
    ): CancelablePromise<UserPrivate> {
        return __request({
            method: 'GET',
            path: `/auth/${provider}/callback`,
        });
    }

}