/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HealthCheck } from '../models/HealthCheck';
import type { CancelablePromise } from '../core/CancelablePromise';
import { request as __request } from '../core/request';

export class UtilService {

    /**
     * Health Check
     * Returns simple json response to see if the server is up and running
     * @returns HealthCheck Health Check Response
     * @throws ApiError
     */
    public static quantuAppWebControllerHealthCheckHealth(): CancelablePromise<HealthCheck> {
        return __request({
            method: 'GET',
            path: `/health`,
        });
    }

    /**
     * Health Check
     * Returns simple json response to see if the server is up and running
     * @returns HealthCheck Health Check Response
     * @throws ApiError
     */
    public static quantuAppWebControllerHealthCheckHealth2(): CancelablePromise<HealthCheck> {
        return __request({
            method: 'HEAD',
            path: `/health`,
        });
    }

}