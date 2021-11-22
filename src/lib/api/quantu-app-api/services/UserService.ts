/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Asset } from '../models/Asset';
import type { AssetCreate } from '../models/AssetCreate';
import type { AssetList } from '../models/AssetList';
import type { AssetUpdate } from '../models/AssetUpdate';
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
import type { UsernameUpdate } from '../models/UsernameUpdate';
import type { UserPrivate } from '../models/UserPrivate';
import type { UserPublic } from '../models/UserPublic';
import type { CancelablePromise } from '../core/CancelablePromise';
import { request as __request } from '../core/request';

export class UserService {

    /**
     * Delete an Email
     * Delete a non-primary Email
     * @param id Email Id
     * @returns void
     * @throws ApiError
     */
    public static quantuAppWebControllerUserEmailDelete(
        id: number,
    ): CancelablePromise<void> {
        return __request({
            method: 'DELETE',
            path: `/user/email/${id}`,
        });
    }

    /**
     * List Quizzes
     * Returns organization's quizzes
     * @param organizationId Organization Id
     * @returns QuizList Organization Quizzes
     * @throws ApiError
     */
    public static quantuAppWebControllerUserQuizIndex(
        organizationId: number,
    ): CancelablePromise<QuizList> {
        return __request({
            method: 'GET',
            path: `/user/organizations/${organizationId}/quizzes`,
        });
    }

    /**
     * Create a Quiz
     * Returns organization's created quiz
     * @param organizationId Organization Id
     * @param requestBody Request body to create quiz
     * @returns Quiz Organization Quiz
     * @throws ApiError
     */
    public static quantuAppWebControllerUserQuizCreate(
        organizationId: number,
        requestBody: QuizCreate,
    ): CancelablePromise<Quiz> {
        return __request({
            method: 'POST',
            path: `/user/organizations/${organizationId}/quizzes`,
            body: requestBody,
            mediaType: 'application/json',
        });
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
    public static quantuAppWebControllerUserQuizAddQuestions(
        id: number,
        organizationId: number,
        requestBody: QuizQuestionIds,
    ): CancelablePromise<void> {
        return __request({
            method: 'POST',
            path: `/user/organizations/${organizationId}/quizzes/${id}/add-questions`,
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Reset Password
     * Resets the User's Password creating a new Token in the process
     * @param requestBody reset user password
     * @returns UserPrivate Confirmed User Email Response
     * @throws ApiError
     */
    public static quantuAppWebControllerUserPasswordReset(
        requestBody: PasswordReset,
    ): CancelablePromise<UserPrivate> {
        return __request({
            method: 'PATCH',
            path: `/user/password/reset`,
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Reset Password
     * Resets the User's Password creating a new Token in the process
     * @param requestBody reset user password
     * @returns UserPrivate Confirmed User Email Response
     * @throws ApiError
     */
    public static quantuAppWebControllerUserPasswordReset2(
        requestBody: PasswordReset,
    ): CancelablePromise<UserPrivate> {
        return __request({
            method: 'PUT',
            path: `/user/password/reset`,
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * List Assets
     * Returns organization's assets
     * @param organizationId Organization Id
     * @param parentId Parent Id
     * @returns AssetList Organization Assetzes
     * @throws ApiError
     */
    public static quantuAppWebControllerUserAssetIndex(
        organizationId: number,
        parentId?: number,
    ): CancelablePromise<AssetList> {
        return __request({
            method: 'GET',
            path: `/user/organizations/${organizationId}/assets`,
            query: {
                'parentId': parentId,
            },
        });
    }

    /**
     * Create a Asset
     * Returns organization's created asset
     * @param organizationId Organization Id
     * @param formData Request body to create asset
     * @returns Asset Organization Asset
     * @throws ApiError
     */
    public static quantuAppWebControllerUserAssetCreate(
        organizationId: number,
        formData: AssetCreate,
    ): CancelablePromise<Asset> {
        return __request({
            method: 'POST',
            path: `/user/organizations/${organizationId}/assets`,
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }

    /**
     * Gets a User by id
     * Returns the user by id
     * @param id User Id
     * @returns UserPublic Current User Response
     * @throws ApiError
     */
    public static quantuAppWebControllerUserShow(
        id: string,
    ): CancelablePromise<UserPublic> {
        return __request({
            method: 'GET',
            path: `/users/${id}`,
        });
    }

    /**
     * Deactivates the Current User
     * Deactivates the current User's account
     * @returns UserPrivate PrivateUser
     * @throws ApiError
     */
    public static quantuAppWebControllerUserDeactivateDeactivate(): CancelablePromise<UserPrivate> {
        return __request({
            method: 'DELETE',
            path: `/user/deactivate`,
        });
    }

    /**
     * List Questions
     * Returns organization's questions
     * @param organizationId Organization Id
     * @param quizId Quiz Id
     * @returns QuestionListPrivate Organization/Quiz Questions
     * @throws ApiError
     */
    public static quantuAppWebControllerUserQuestionIndex(
        organizationId: number,
        quizId?: number,
    ): CancelablePromise<QuestionListPrivate> {
        return __request({
            method: 'GET',
            path: `/user/organizations/${organizationId}/questions`,
            query: {
                'quizId': quizId,
            },
        });
    }

    /**
     * Create a Question
     * Returns organization's created question
     * @param organizationId Organization Id
     * @param requestBody Request body to create question
     * @returns QuestionPrivate Organization/Quiz Question
     * @throws ApiError
     */
    public static quantuAppWebControllerUserQuestionCreate(
        organizationId: number,
        requestBody: QuestionCreate,
    ): CancelablePromise<QuestionPrivate> {
        return __request({
            method: 'POST',
            path: `/user/organizations/${organizationId}/questions`,
            body: requestBody,
            mediaType: 'application/json',
        });
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
    public static quantuAppWebControllerUserQuizRemoveQuestions(
        id: number,
        organizationId: number,
        requestBody: QuizQuestionIds,
    ): CancelablePromise<void> {
        return __request({
            method: 'POST',
            path: `/user/organizations/${organizationId}/quizzes/${id}/remove-questions`,
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Delete a Quiz
     * Returns nothing
     * @param id Quiz Id
     * @param organizationId Organization Id
     * @returns void
     * @throws ApiError
     */
    public static quantuAppWebControllerUserQuizDelete(
        id: number,
        organizationId: number,
    ): CancelablePromise<void> {
        return __request({
            method: 'DELETE',
            path: `/user/organizations/${organizationId}/quizzes/${id}`,
        });
    }

    /**
     * Get a Quiz
     * Returns organization's quiz
     * @param id Quiz Id
     * @param organizationId Organization Id
     * @returns Quiz Organization Quiz
     * @throws ApiError
     */
    public static quantuAppWebControllerUserQuizShow(
        id: number,
        organizationId: number,
    ): CancelablePromise<Quiz> {
        return __request({
            method: 'GET',
            path: `/user/organizations/${organizationId}/quizzes/${id}`,
        });
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
    public static quantuAppWebControllerUserQuizUpdate(
        id: number,
        organizationId: number,
        requestBody: QuizUpdate,
    ): CancelablePromise<Quiz> {
        return __request({
            method: 'PATCH',
            path: `/user/organizations/${organizationId}/quizzes/${id}`,
            body: requestBody,
            mediaType: 'application/json',
        });
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
    public static quantuAppWebControllerUserQuizUpdate2(
        id: number,
        organizationId: number,
        requestBody: QuizUpdate,
    ): CancelablePromise<Quiz> {
        return __request({
            method: 'PUT',
            path: `/user/organizations/${organizationId}/quizzes/${id}`,
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Update User's Username
     * Updates a User's Username
     * @param requestBody Update User's Username Body
     * @returns UserPrivate Update User's Username Response
     * @throws ApiError
     */
    public static quantuAppWebControllerUserUsernameUpdate(
        requestBody: UsernameUpdate,
    ): CancelablePromise<UserPrivate> {
        return __request({
            method: 'PATCH',
            path: `/user/username`,
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Update User's Username
     * Updates a User's Username
     * @param requestBody Update User's Username Body
     * @returns UserPrivate Update User's Username Response
     * @throws ApiError
     */
    public static quantuAppWebControllerUserUsernameUpdate2(
        requestBody: UsernameUpdate,
    ): CancelablePromise<UserPrivate> {
        return __request({
            method: 'PUT',
            path: `/user/username`,
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Set Email as Primary
     * Sets an Email as User's Primary Email
     * @param id Email Id
     * @returns Email Set Primary Email Response
     * @throws ApiError
     */
    public static quantuAppWebControllerUserEmailSetPrimary(
        id: number,
    ): CancelablePromise<Email> {
        return __request({
            method: 'PATCH',
            path: `/user/email/${id}/primary`,
        });
    }

    /**
     * Set Email as Primary
     * Sets an Email as User's Primary Email
     * @param id Email Id
     * @returns Email Set Primary Email Response
     * @throws ApiError
     */
    public static quantuAppWebControllerUserEmailSetPrimary2(
        id: number,
    ): CancelablePromise<Email> {
        return __request({
            method: 'PUT',
            path: `/user/email/${id}/primary`,
        });
    }

    /**
     * Create an Eamil
     * Create and returns an Email
     * @param requestBody Create Email Body
     * @returns Email Create an Email Response
     * @throws ApiError
     */
    public static quantuAppWebControllerUserEmailCreate(
        requestBody: EmailCreate,
    ): CancelablePromise<Email> {
        return __request({
            method: 'POST',
            path: `/user/email`,
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Delete a Question
     * Returns nothing
     * @param id Question Id
     * @param organizationId Organization Id
     * @returns void
     * @throws ApiError
     */
    public static quantuAppWebControllerUserQuestionDelete(
        id: number,
        organizationId: number,
    ): CancelablePromise<void> {
        return __request({
            method: 'DELETE',
            path: `/user/organizations/${organizationId}/questions/${id}`,
        });
    }

    /**
     * Get a Question
     * Returns organization's question
     * @param id Question Id
     * @param organizationId Organization Id
     * @returns QuestionPrivate Organization/Quiz Question
     * @throws ApiError
     */
    public static quantuAppWebControllerUserQuestionShow(
        id: number,
        organizationId: number,
    ): CancelablePromise<QuestionPrivate> {
        return __request({
            method: 'GET',
            path: `/user/organizations/${organizationId}/questions/${id}`,
        });
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
    public static quantuAppWebControllerUserQuestionUpdate(
        id: number,
        organizationId: number,
        requestBody: QuestionUpdate,
    ): CancelablePromise<QuestionPrivate> {
        return __request({
            method: 'PATCH',
            path: `/user/organizations/${organizationId}/questions/${id}`,
            body: requestBody,
            mediaType: 'application/json',
        });
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
    public static quantuAppWebControllerUserQuestionUpdate2(
        id: number,
        organizationId: number,
        requestBody: QuestionUpdate,
    ): CancelablePromise<QuestionPrivate> {
        return __request({
            method: 'PUT',
            path: `/user/organizations/${organizationId}/questions/${id}`,
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * List Organizations
     * Returns user's organizations
     * @returns OrganizationList User Organizations
     * @throws ApiError
     */
    public static quantuAppWebControllerUserOrganizationIndex(): CancelablePromise<OrganizationList> {
        return __request({
            method: 'GET',
            path: `/user/organizations`,
        });
    }

    /**
     * Create a Organization
     * Returns user's created organization
     * @param requestBody Request body to create organization
     * @returns Organization User Organization
     * @throws ApiError
     */
    public static quantuAppWebControllerUserOrganizationCreate(
        requestBody: OrganizationCreate,
    ): CancelablePromise<Organization> {
        return __request({
            method: 'POST',
            path: `/user/organizations`,
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Delete a Organization
     * Returns nothing
     * @param id Organization Id
     * @returns void
     * @throws ApiError
     */
    public static quantuAppWebControllerUserOrganizationDelete(
        id: number,
    ): CancelablePromise<void> {
        return __request({
            method: 'DELETE',
            path: `/user/organizations/${id}`,
        });
    }

    /**
     * Get a Organization
     * Returns user's organization
     * @param id Organization Id
     * @returns Organization User Organization
     * @throws ApiError
     */
    public static quantuAppWebControllerUserOrganizationShow(
        id: number,
    ): CancelablePromise<Organization> {
        return __request({
            method: 'GET',
            path: `/user/organizations/${id}`,
        });
    }

    /**
     * Updates a Organization
     * Returns user's updated organization
     * @param id Organization Id
     * @param requestBody Request body to update organization
     * @returns Organization User Organization
     * @throws ApiError
     */
    public static quantuAppWebControllerUserOrganizationUpdate(
        id: number,
        requestBody: OrganizationUpdate,
    ): CancelablePromise<Organization> {
        return __request({
            method: 'PATCH',
            path: `/user/organizations/${id}`,
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Updates a Organization
     * Returns user's updated organization
     * @param id Organization Id
     * @param requestBody Request body to update organization
     * @returns Organization User Organization
     * @throws ApiError
     */
    public static quantuAppWebControllerUserOrganizationUpdate2(
        id: number,
        requestBody: OrganizationUpdate,
    ): CancelablePromise<Organization> {
        return __request({
            method: 'PUT',
            path: `/user/organizations/${id}`,
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Confirm an Eamil
     * Confirms an Email and returns the User with the Bearer Token
     * @param confirmationToken Confirmation Token
     * @returns UserPrivate Confirmed User Email Response
     * @throws ApiError
     */
    public static quantuAppWebControllerUserEmailConfirm(
        confirmationToken: string,
    ): CancelablePromise<UserPrivate> {
        return __request({
            method: 'PATCH',
            path: `/user/email/confirm`,
            query: {
                'confirmationToken': confirmationToken,
            },
        });
    }

    /**
     * Confirm an Eamil
     * Confirms an Email and returns the User with the Bearer Token
     * @param confirmationToken Confirmation Token
     * @returns UserPrivate Confirmed User Email Response
     * @throws ApiError
     */
    public static quantuAppWebControllerUserEmailConfirm2(
        confirmationToken: string,
    ): CancelablePromise<UserPrivate> {
        return __request({
            method: 'PUT',
            path: `/user/email/confirm`,
            query: {
                'confirmationToken': confirmationToken,
            },
        });
    }

    /**
     * Delete a Asset
     * Returns nothing
     * @param id Asset Id
     * @param organizationId Organization Id
     * @returns void
     * @throws ApiError
     */
    public static quantuAppWebControllerUserAssetDelete(
        id: number,
        organizationId: number,
    ): CancelablePromise<void> {
        return __request({
            method: 'DELETE',
            path: `/user/organizations/${organizationId}/assets/${id}`,
        });
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
    public static quantuAppWebControllerUserAssetShow(
        id: number,
        organizationId: number,
        parentId?: number,
    ): CancelablePromise<Asset> {
        return __request({
            method: 'GET',
            path: `/user/organizations/${organizationId}/assets/${id}`,
            query: {
                'parentId': parentId,
            },
        });
    }

    /**
     * Updates a Asset
     * Returns organization's updated asset
     * @param id Asset Id
     * @param organizationId Organization Id
     * @param formData Request body to update asset
     * @returns Asset Organization Asset
     * @throws ApiError
     */
    public static quantuAppWebControllerUserAssetUpdate(
        id: number,
        organizationId: number,
        formData: AssetUpdate,
    ): CancelablePromise<Asset> {
        return __request({
            method: 'PATCH',
            path: `/user/organizations/${organizationId}/assets/${id}`,
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }

    /**
     * Updates a Asset
     * Returns organization's updated asset
     * @param id Asset Id
     * @param organizationId Organization Id
     * @param formData Request body to update asset
     * @returns Asset Organization Asset
     * @throws ApiError
     */
    public static quantuAppWebControllerUserAssetUpdate2(
        id: number,
        organizationId: number,
        formData: AssetUpdate,
    ): CancelablePromise<Asset> {
        return __request({
            method: 'PUT',
            path: `/user/organizations/${organizationId}/assets/${id}`,
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }

}