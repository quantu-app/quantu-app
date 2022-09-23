import type { Department } from '@prisma/client';
import { writable, derived } from 'svelte/store';
import { JSON_HEADERS, type IFetch } from '$lib/utils';
import { addOrUpdate, resourceFromJSON } from './common';
import { apiDepartmentPath, apiDepartmentsPath } from '$lib/routingUtils';

const departmentsWritable = writable<Department[]>([]);

export const departments = derived(departmentsWritable, (departments) => departments);

/**
 * Derived Stores
 */
export const departmentsById = derived(departmentsWritable, (departments) =>
	departments.reduce((byId, department) => {
		byId[department.id] = department;
		return byId;
	}, {} as { [id: string]: Department })
);
export const departmentsByUrl = derived(departmentsWritable, (departments) =>
	departments.reduce((byUrl, department) => {
		byUrl[department.url] = department;
		return byUrl;
	}, {} as { [url: string]: Department })
);

interface APIError {
	code: string;
	status: number;
	message: string;
}

function handleErrors(response: Response): APIError | undefined {
	if (response.ok) {
		return
	}

	if (response.status === 404) {
		return {
			code: "NOT_FOUND",
			status: 404,
			message: response.statusText,
		};
	}
	if (response.status === 500) {
		return {
			code: "INTERNAL_SERVER_ERROR",
			status: 500,
			message: response.statusText
		}
	}
}

export async function showDepartmentByUrl(url: string, fetchFn: IFetch = fetch): Promise<Department> {
	const res = await fetchFn(apiDepartmentPath(url), { headers: JSON_HEADERS });
	const error = handleErrors(res);
	if (error) {
		throw error;
	}
	const department: Department = resourceFromJSON<Department>(await res.json());
	departmentsWritable.update((state) => addOrUpdate(state.slice(), department));
	return department;
}

export async function showDepartments(fetchFn: IFetch = fetch): Promise<Department[]> {
	const res = await fetchFn(apiDepartmentsPath(), { headers: JSON_HEADERS });
	if (!res.ok) {
		throw await res.json();
	}
	const departments: Department[] = (await res.json()).map(resourceFromJSON<Department>);
	departmentsWritable.set(departments);
	return departments;
}