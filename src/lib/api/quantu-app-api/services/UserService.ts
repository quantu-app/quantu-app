/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Asset } from '../models/Asset';
import type { AssetList } from '../models/AssetList';
import type { Email } from '../models/Email';
import type { EmailCreate } from '../models/EmailCreate';
import type { Organization } from '../models/Organization';
import type { OrganizationCreate } from '../models/OrganizationCreate';
import type { OrganizationList } from '../models/OrganizationList';
import type { OrganizationUpdate } from '../models/OrganizationUpdate';
import type { PasswordReset } from '../models/PasswordReset';
import type { QuestionCreate } from '../models/QuestionCreate';
import type { QuestionListPrivate } from '../models/QuestionListPrivate';
import type { QuestionPrivate } from '../models/QuestionPrivate';
import type { QuestionUpdate } from '../models/QuestionUpdate';
import type { Quiz } from '../models/Quiz';
import type { QuizCreate } from '../models/QuizCreate';
import type { QuizList } from '../models/QuizList';
import type { QuizQuestionIds } from '../models/QuizQuestionIds';
import type { QuizUpdate } from '../models/QuizUpdate';
import type { User } from '../models/User';
import type { UsernameUpdate } from '../models/UsernameUpdate';
import { request as __request } from '../core/request';

export class UserService {

    /**
     * Delete an Email
     * Delete a non-primary Email
     * @param id Email Id
     * @returns void
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserEmailDelete(
        id: number,
    ): Promise<void> {
        const result = await __request({
            method: 'DELETE',
            path: `/user/email/${id}`,
        });
        return result.body;
    }

    /**
     * List Quizzes
     * Returns organization's quizzes
     * @param organizationId Organization Id
     * @returns QuizList Organization Quizzes
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserQuizIndex(
        organizationId: number,
    ): Promise<QuizList> {
        const result = await __request({
            method: 'GET',
            path: `/user/organizations/${organizationId}/quizzes`,
        });
        return result.body;
    }

    /**
     * Create a Quiz
     * Returns organization's created quiz
     * @param organizationId Organization Id
     * @param requestBody Request body to create quiz
     * @returns Quiz Organization Quiz
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserQuizCreate(
        organizationId: number,
        requestBody: QuizCreate,
    ): Promise<Quiz> {
        const result = await __request({
            method: 'POST',
            path: `/user/organizations/${organizationId}/quizzes`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Add Quertions to Quiz
     * Returns nothing
     * @param id Quiz Id
     * @param organizationId Organization Id
     * @param requestBody Request body to add questions to quiz
     * @returns void
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserQuizAddQuestions(
        id: number,
        organizationId: number,
        requestBody: QuizQuestionIds,
    ): Promise<void> {
        const result = await __request({
            method: 'POST',
            path: `/user/organizations/${organizationId}/quizzes/${id}/add-questions`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Reset Password
     * Resets the User's Password creating a new Token in the process
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
     * List Assets
     * Returns organization's assets
     * @param organizationId Organization Id
     * @param parentId Parent Id
     * @returns AssetList Organization Assetzes
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserAssetIndex(
        organizationId: number,
        parentId?: number,
    ): Promise<AssetList> {
        const result = await __request({
            method: 'GET',
            path: `/user/organizations/${organizationId}/assets`,
            query: {
                'parentId': parentId,
            },
        });
        return result.body;
    }

    /**
     * Create a Asset
     * Returns organization's created asset
     * @param organizationId Organization Id
     * @param requestBody Request body to create asset
     * @returns Asset Organization Asset
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserAssetCreate(
        organizationId: number,
        requestBody: any,
    ): Promise<Asset> {
        const result = await __request({
            method: 'POST',
            path: `/user/organizations/${organizationId}/assets`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Deactivates the Current User
     * Deactivates the current User's account
     * @returns User PrivateUser
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserDeactivateDeactivate(): Promise<User> {
        const result = await __request({
            method: 'DELETE',
            path: `/user/deactivate`,
        });
        return result.body;
    }

    /**
     * List Questions
     * Returns organization's questions
     * @param organizationId Organization Id
     * @param quizId Quiz Id
     * @returns QuestionListPrivate Organization/Quiz Questions
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserQuestionIndex(
        organizationId: number,
        quizId?: number,
    ): Promise<QuestionListPrivate> {
        const result = await __request({
            method: 'GET',
            path: `/user/organizations/${organizationId}/questions`,
            query: {
                'quizId': quizId,
            },
        });
        return result.body;
    }

    /**
     * Create a Question
     * Returns organization's created question
     * @param organizationId Organization Id
     * @param requestBody Request body to create question
     * @returns QuestionPrivate Organization/Quiz Question
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserQuestionCreate(
        organizationId: number,
        requestBody: QuestionCreate,
    ): Promise<QuestionPrivate> {
        const result = await __request({
            method: 'POST',
            path: `/user/organizations/${organizationId}/questions`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Remove Quertions from Quiz
     * Returns nothing
     * @param id Quiz Id
     * @param organizationId Organization Id
     * @param requestBody Request body to remove questions from quiz
     * @returns void
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserQuizRemoveQuestions(
        id: number,
        organizationId: number,
        requestBody: QuizQuestionIds,
    ): Promise<void> {
        const result = await __request({
            method: 'POST',
            path: `/user/organizations/${organizationId}/quizzes/${id}/remove-questions`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Delete a Quiz
     * Returns nothing
     * @param id Quiz Id
     * @param organizationId Organization Id
     * @returns void
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserQuizDelete(
        id: number,
        organizationId: number,
    ): Promise<void> {
        const result = await __request({
            method: 'DELETE',
            path: `/user/organizations/${organizationId}/quizzes/${id}`,
        });
        return result.body;
    }

    /**
     * Get a Quiz
     * Returns organization's quiz
     * @param id Quiz Id
     * @param organizationId Organization Id
     * @returns Quiz Organization Quiz
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserQuizShow(
        id: number,
        organizationId: number,
    ): Promise<Quiz> {
        const result = await __request({
            method: 'GET',
            path: `/user/organizations/${organizationId}/quizzes/${id}`,
        });
        return result.body;
    }

    /**
     * Updates a Quiz
     * Returns organization's updated quiz
     * @param id Quiz Id
     * @param organizationId Organization Id
     * @param requestBody Request body to update quiz
     * @returns Quiz Organization Quiz
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserQuizUpdate(
        id: number,
        organizationId: number,
        requestBody: QuizUpdate,
    ): Promise<Quiz> {
        const result = await __request({
            method: 'PATCH',
            path: `/user/organizations/${organizationId}/quizzes/${id}`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Updates a Quiz
     * Returns organization's updated quiz
     * @param id Quiz Id
     * @param organizationId Organization Id
     * @param requestBody Request body to update quiz
     * @returns Quiz Organization Quiz
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserQuizUpdate2(
        id: number,
        organizationId: number,
        requestBody: QuizUpdate,
    ): Promise<Quiz> {
        const result = await __request({
            method: 'PUT',
            path: `/user/organizations/${organizationId}/quizzes/${id}`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Update User's Username
     * Updates a User's Username
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

    /**
     * Set Email as Primary
     * Sets an Email as User's Primary Email
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
     * Create an Eamil
     * Create and returns an Email
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
     * Delete a Question
     * Returns nothing
     * @param id Question Id
     * @param organizationId Organization Id
     * @returns void
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserQuestionDelete(
        id: number,
        organizationId: number,
    ): Promise<void> {
        const result = await __request({
            method: 'DELETE',
            path: `/user/organizations/${organizationId}/questions/${id}`,
        });
        return result.body;
    }

    /**
     * Get a Question
     * Returns organization's question
     * @param id Question Id
     * @param organizationId Organization Id
     * @returns QuestionPrivate Organization/Quiz Question
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserQuestionShow(
        id: number,
        organizationId: number,
    ): Promise<QuestionPrivate> {
        const result = await __request({
            method: 'GET',
            path: `/user/organizations/${organizationId}/questions/${id}`,
        });
        return result.body;
    }

    /**
     * Updates a Question
     * Returns organization's updated question
     * @param id Question Id
     * @param organizationId Organization Id
     * @param requestBody Request body to update question
     * @returns QuestionPrivate Organization/Quiz Question
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserQuestionUpdate(
        id: number,
        organizationId: number,
        requestBody: QuestionUpdate,
    ): Promise<QuestionPrivate> {
        const result = await __request({
            method: 'PATCH',
            path: `/user/organizations/${organizationId}/questions/${id}`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Updates a Question
     * Returns organization's updated question
     * @param id Question Id
     * @param organizationId Organization Id
     * @param requestBody Request body to update question
     * @returns QuestionPrivate Organization/Quiz Question
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserQuestionUpdate2(
        id: number,
        organizationId: number,
        requestBody: QuestionUpdate,
    ): Promise<QuestionPrivate> {
        const result = await __request({
            method: 'PUT',
            path: `/user/organizations/${organizationId}/questions/${id}`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * List Organizations
     * Returns user's organizations
     * @returns OrganizationList User Organizations
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserOrganizationIndex(): Promise<OrganizationList> {
        const result = await __request({
            method: 'GET',
            path: `/user/organizations`,
        });
        return result.body;
    }

    /**
     * Create a Organization
     * Returns user's created organization
     * @param requestBody Request body to create organization
     * @returns Organization User Organization
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserOrganizationCreate(
        requestBody: OrganizationCreate,
    ): Promise<Organization> {
        const result = await __request({
            method: 'POST',
            path: `/user/organizations`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Delete a Organization
     * Returns nothing
     * @param id Organization Id
     * @returns void
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserOrganizationDelete(
        id: number,
    ): Promise<void> {
        const result = await __request({
            method: 'DELETE',
            path: `/user/organizations/${id}`,
        });
        return result.body;
    }

    /**
     * Get a Organization
     * Returns user's organization
     * @param id Organization Id
     * @returns Organization User Organization
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserOrganizationShow(
        id: number,
    ): Promise<Organization> {
        const result = await __request({
            method: 'GET',
            path: `/user/organizations/${id}`,
        });
        return result.body;
    }

    /**
     * Updates a Organization
     * Returns user's updated organization
     * @param id Organization Id
     * @param requestBody Request body to update organization
     * @returns Organization User Organization
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserOrganizationUpdate(
        id: number,
        requestBody: OrganizationUpdate,
    ): Promise<Organization> {
        const result = await __request({
            method: 'PATCH',
            path: `/user/organizations/${id}`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Updates a Organization
     * Returns user's updated organization
     * @param id Organization Id
     * @param requestBody Request body to update organization
     * @returns Organization User Organization
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserOrganizationUpdate2(
        id: number,
        requestBody: OrganizationUpdate,
    ): Promise<Organization> {
        const result = await __request({
            method: 'PUT',
            path: `/user/organizations/${id}`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Confirm an Eamil
     * Confirms an Email and returns the User with the Bearer Token
     * @param confirmationToken Confirmation Token
     * @returns User Confirmed User Email Response
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserEmailConfirm(
        confirmationToken: string,
    ): Promise<User> {
        const result = await __request({
            method: 'PATCH',
            path: `/user/email/confirm`,
            query: {
                'confirmationToken': confirmationToken,
            },
        });
        return result.body;
    }

    /**
     * Confirm an Eamil
     * Confirms an Email and returns the User with the Bearer Token
     * @param confirmationToken Confirmation Token
     * @returns User Confirmed User Email Response
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserEmailConfirm2(
        confirmationToken: string,
    ): Promise<User> {
        const result = await __request({
            method: 'PUT',
            path: `/user/email/confirm`,
            query: {
                'confirmationToken': confirmationToken,
            },
        });
        return result.body;
    }

    /**
     * Delete a Asset
     * Returns nothing
     * @param id Asset Id
     * @param organizationId Organization Id
     * @returns void
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserAssetDelete(
        id: number,
        organizationId: number,
    ): Promise<void> {
        const result = await __request({
            method: 'DELETE',
            path: `/user/organizations/${organizationId}/assets/${id}`,
        });
        return result.body;
    }

    /**
     * Get a Asset
     * Returns organization's asset
     * @param id Asset Id
     * @param organizationId Organization Id
     * @param parentId Parent Id
     * @returns Asset Organization Asset
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserAssetShow(
        id: number,
        organizationId: number,
        parentId?: number,
    ): Promise<Asset> {
        const result = await __request({
            method: 'GET',
            path: `/user/organizations/${organizationId}/assets/${id}`,
            query: {
                'parentId': parentId,
            },
        });
        return result.body;
    }

    /**
     * Updates a Asset
     * Returns organization's updated asset
     * @param id Asset Id
     * @param organizationId Organization Id
     * @param requestBody Request body to update asset
     * @returns Asset Organization Asset
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserAssetUpdate(
        id: number,
        organizationId: number,
        requestBody: any,
    ): Promise<Asset> {
        const result = await __request({
            method: 'PATCH',
            path: `/user/organizations/${organizationId}/assets/${id}`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * Updates a Asset
     * Returns organization's updated asset
     * @param id Asset Id
     * @param organizationId Organization Id
     * @param requestBody Request body to update asset
     * @returns Asset Organization Asset
     * @throws ApiError
     */
    public static async quantuAppWebControllerUserAssetUpdate2(
        id: number,
        organizationId: number,
        requestBody: any,
    ): Promise<Asset> {
        const result = await __request({
            method: 'PUT',
            path: `/user/organizations/${organizationId}/assets/${id}`,
            body: requestBody,
        });
        return result.body;
    }

}