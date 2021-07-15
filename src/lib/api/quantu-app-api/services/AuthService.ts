/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SignIn_UsernameOrEmailAndPassword } from '../models/SignIn_UsernameOrEmailAndPassword';
import type { SignUp_UsernamePassword } from '../models/SignUp_UsernamePassword';
import type { User_Private } from '../models/User_Private';
import { request as __request } from '../core/request';

export class AuthService {

    /**
     * Sign current User out
     * Signs out the current User based on the bearer token
     *
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
     *
     * @returns User_Private Current User Response
     * @throws ApiError
     */
    public static async quantuAppWebControllerAuthCurrent(): Promise<User_Private> {
        const result = await __request({
            method: 'GET',
            path: `/auth`,
        });
        return result.body;
    }

    /**
     * Sign in
     * Signs in user and returns the User with the Bearer Token
     *
     * @param requestBody Request body to sign in
     * @returns User_Private Sign in User Response
     * @throws ApiError
     */
    public static async quantuAppWebControllerAuthSignInSignIn(
        requestBody: SignIn_UsernameOrEmailAndPassword,
    ): Promise<User_Private> {
        const result = await __request({
            method: 'POST',
            path: `/auth/sign-in`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Sign up
     * Signs up a user and returns the User with the Bearer Token
     *
     * @param requestBody Request body to sign up
     * @returns User_Private Sign up User Response
     * @throws ApiError
     */
    public static async quantuAppWebControllerAuthSignUpSignUp(
        requestBody: SignUp_UsernamePassword,
    ): Promise<User_Private> {
        const result = await __request({
            method: 'POST',
            path: `/auth/sign-up`,
            body: requestBody,
        });
        return result.body;
    }

}