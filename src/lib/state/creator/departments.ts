import type { Department } from '@prisma/client';
import { writable, derived } from 'svelte/store';
import { base } from '$app/paths';
import { createQueryParams, type IFetch } from '$lib/utils';

export type StateDepartment = Department & {
	logo?: {
		name: string;
	};
};

const departmentsWritable = writable<StateDepartment[]>([]);

export const departments = derived(departmentsWritable, (departments) => departments);

export const departmentsById = derived(departmentsWritable, (departments) =>
	departments.reduce((byId, department) => {
		byId[department.id] = department;
		return byId;
	}, {} as { [id: string]: StateDepartment })
);

export async function showDepartmentById(id: string, fetchFn: IFetch = fetch) {
	const res = await fetchFn(`${base}/api/creator/departments/${id}`, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok) {
		throw await res.json();
	}
	const department: StateDepartment = departmentFromJSON(await res.json());
	departmentsWritable.update((state) => addOrUpdate(state.slice(), department));
	return department;
}

export async function showDepartments(ids: string[] = [], fetchFn: IFetch = fetch) {
	const res =
		ids && ids.length
			? await fetchFn(`${base}/api/creator/departments${createQueryParams({ ids })}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(ids)
			  })
			: await fetchFn(`${base}/api/creator/departments${createQueryParams({ ids })}`, {
					headers: {
						'Content-Type': 'application/json'
					}
			  });
	if (!res.ok) {
		throw await res.json();
	}
	const departments: StateDepartment[] = (await res.json()).map(departmentFromJSON);
	departmentsWritable.update((state) =>
		departments.reduce((state, department) => addOrUpdate(state, department), state.slice())
	);
	return departments;
}

export async function validDepartmentUrl(url: string) {
	const res = await fetch(`${base}/api/departments/${url}`, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok) {
		return true;
	} else {
		return false;
	}
}

export async function createDepartment(body: Partial<StateDepartment>) {
	const res = await fetch(`${base}/api/creator/departments`, {
		method: 'POST',
		body: JSON.stringify(body)
	});
	if (!res.ok) {
		throw await res.json();
	}
	const department: StateDepartment = departmentFromJSON(await res.json());
	departmentsWritable.update((state) => addOrUpdate(state.slice(), department));
	return department;
}

export async function updateDepartment(id: string, body: Partial<StateDepartment>) {
	const res = await fetch(`${base}/api/creator/departments/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(body)
	});
	if (!res.ok) {
		throw await res.json();
	}
	const department: StateDepartment = departmentFromJSON(await res.json());
	departmentsWritable.update((state) => addOrUpdate(state.slice(), department));
	return department;
}

export async function deleteDepartment(id: string) {
	const res = await fetch(`${base}/api/creator/departments/${id}`, {
		method: 'DELETE'
	});
	if (!res.ok) {
		throw await res.json();
	}
	departmentsWritable.update((state) => {
		const index = state.findIndex((department) => department.id === id);
		if (index !== -1) {
			state = state.slice();
			state.splice(index, 1);
		}
		return state;
	});
}

export function addDepartment(department: StateDepartment) {
	departmentsWritable.update((state) => addOrUpdate(state.slice(), department));
}

function addOrUpdate(
	departments: StateDepartment[],
	department: StateDepartment
): StateDepartment[] {
	const index = departments.findIndex((t) => t.id === department.id);
	if (index === -1) {
		departments.push(department);
	} else {
		departments[index] = department;
	}
	return departments;
}

export function departmentFromJSON(department: StateDepartment): StateDepartment {
	return {
		...department,
		createdAt: new Date(department.createdAt),
		updatedAt: new Date(department.updatedAt)
	};
}
