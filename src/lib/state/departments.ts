import type { Department } from '@prisma/client';
import { writable, derived, get } from 'svelte/store';
import { base } from '$app/paths';

const departmentsWritable = writable<Department[]>([]);

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

export async function showDepartmentsByUrl(url: string) {
	const cachedDepartment = get(departmentsByUrl)[url];
	if (cachedDepartment) {
		return cachedDepartment;
	}
	const res = await fetch(`${base}/api/departments/${url}`);
	if (!res.ok) {
		throw await res.json();
	}
	const departments: Department[] = await res.json();
	departmentsWritable.update((state) =>
		departments.reduce((state, department) => addOrUpdate(state, department), state)
	);
	return departments;
}

export async function showDepartments() {
	const res = await fetch(`${base}/api/departments`);
	if (!res.ok) {
		throw await res.json();
	}
	const departments: Department[] = await res.json();
	departmentsWritable.set(departments);
	return departments;
}

function addOrUpdate(state: Department[], department: Department) {
	const index = state.findIndex((t) => t.id === department.id);
	if (index === -1) {
		state.push(department);
	} else {
		state[index] = department;
	}
	return state;
}