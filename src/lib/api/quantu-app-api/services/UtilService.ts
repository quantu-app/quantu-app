/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HealthCheck } from '../models/HealthCheck';
import { request as __request } from '../core/request';

export class UtilService {

    /**
     * Health Check
     * Returns simple json response to see if the server is up and running
     *
     * @returns HealthCheck Health Check Response
     * @throws ApiError
     */
    public static async quantuAppWebControllerHealthCheckHealth(): Promise<HealthCheck> {
        const result = await __request({
            method: 'GET',
            path: `/health`,
        });
        return result.body;
    }

    /**
     * Health Check
     * Returns simple json response to see if the server is up and running
     *
     * @returns HealthCheck Health Check Response
     * @throws ApiError
     */
    public static async quantuAppWebControllerHealthCheckHealth2(): Promise<HealthCheck> {
        const result = await __request({
            method: 'HEAD',
            path: `/health`,
        });
        return result.body;
    }

}