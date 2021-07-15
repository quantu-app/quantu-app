/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Util_HealthCheck } from '../models/Util_HealthCheck';
import { request as __request } from '../core/request';

export class UtilService {

    /**
     * Health Check
     * Returns simple json response to see if the server is up and running
     *
     * @returns Util_HealthCheck Health Check Response
     * @throws ApiError
     */
    public static async quantuAppWebControllerHealthCheckHealth(): Promise<Util_HealthCheck> {
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
     * @returns Util_HealthCheck Health Check Response
     * @throws ApiError
     */
    public static async quantuAppWebControllerHealthCheckHealth2(): Promise<Util_HealthCheck> {
        const result = await __request({
            method: 'HEAD',
            path: `/health`,
        });
        return result.body;
    }

}