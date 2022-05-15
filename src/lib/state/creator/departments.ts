import type { Department } from '@prisma/client';
import { writable, derived } from 'svelte/store';
import { base } from '$app/paths';
import type { IFetch } from '$lib/utils';

const departmentsWritable = writable<Department[]>([]);

export const departments = derived(departmentsWritable, (departments) => departments);

export const departmentsById = derived(departmentsWritable, (departments) =>
	departments.reduce((byId, department) => {
		byId[department.id] = department;
		return byId;
	}, {} as { [id: string]: Department })
);

export async function showDepartmentsById(id: string, fetchFn: IFetch = fetch) {
	const res = await fetchFn(`${base}/api/creator/departments/${id}`, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok) {
		throw await res.json();
	}
	const department: Department = departmentFromJSON(await res.json());
	departmentsWritable.update((state) => addOrUpdate(state.slice(), department));
	return department;
}

export async function showDepartments(fetchFn: IFetch = fetch) {
	const res = await fetchFn(`${base}/api/creator/departments`, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok) {
		throw await res.json();
	}
	const departments: Department[] = (await res.json()).map(departmentFromJSON);
	departmentsWritable.update((state) =>
		departments.reduce((state, department) => addOrUpdate(state, department), state.slice())
	);
	return departments;
}

export async function createDepartment(body: Partial<Department>) {
	const res = await fetch(`${base}/api/creator/departments`, {
		method: 'POST',
		body: JSON.stringify(body)
	});
	if (!res.ok) {
		throw await res.json();
	}
	const department: Department = departmentFromJSON(await res.json());
	departmentsWritable.update((state) => addOrUpdate(state.slice(), department));
	return department;
}

export async function updateDepartment(id: string, body: Partial<Department>) {
	const res = await fetch(`${base}/api/creator/departments/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(body)
	});
	if (!res.ok) {
		throw await res.json();
	}
	const department: Department = departmentFromJSON(await res.json());
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

function addOrUpdate(departments: Department[], department: Department): Department[] {
	const index = departments.findIndex((t) => t.id === department.id);
	if (index === -1) {
		departments.push(department);
	} else {
		departments[index] = department;
	}
	return departments;
}

function departmentFromJSON(department: Department): Department {
	return {
		...department,
		createdAt: new Date(department.createdAt),
		updatedAt: new Date(department.updatedAt)
	};
}
