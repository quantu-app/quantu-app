/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SignInUsernameOrEmailAndPassword } from '../models/SignInUsernameOrEmailAndPassword';
import type { SignUpUsernamePassword } from '../models/SignUpUsernamePassword';
import type { User } from '../models/User';
import { request as __request } from '../core/request';

export class AuthService {

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
     * @returns User Current User Response
     * @throws ApiError
     */
    public static async quantuAppWebControllerAuthCurrent(): Promise<User> {
        const result = await __request({
            method: 'GET',
            path: `/auth`,
        });
        return result.body;
    }

    /**
     * Signs in user and returns the User with the Bearer Token
     * @param requestBody Request body to sign in
     * @returns User Sign in User Response
     * @throws ApiError
     */
    public static async quantuAppWebControllerAuthSignInSignIn(
        requestBody: SignInUsernameOrEmailAndPassword,
    ): Promise<User> {
        const result = await __request({
            method: 'POST',
            path: `/auth/sign-in`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Signs up a user and returns the User with the Bearer Token
     * @param requestBody Request body to sign up
     * @returns User Sign up User Response
     * @throws ApiError
     */
    public static async quantuAppWebControllerAuthSignUpSignUp(
        requestBody: SignUpUsernamePassword,
    ): Promise<User> {
        const result = await __request({
            method: 'POST',
            path: `/auth/sign-up`,
            body: requestBody,
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
     * Signs in the Current User
     * Returns the current user
     * @param provider Auth Provider
     * @returns User User Response
     * @throws ApiError
     */
    public static async quantuAppWebControllerAuthCallback(
        provider: string,
    ): Promise<User> {
        const result = await __request({
            method: 'GET',
            path: `/auth/${provider}/callback`,
        });
        return result.body;
    }

}