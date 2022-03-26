import type { Department } from '@prisma/client';
import { writable, derived } from 'svelte/store';
import { base } from '$app/paths';

const departmentsWritable = writable<Department[]>([]);

export const departments = derived(departmentsWritable, (departments) => departments);

export const departmentsById = derived(departmentsWritable, (departments) =>
	departments.reduce((byId, department) => {
		byId[department.id] = department;
		return byId;
	}, {} as { [id: string]: Department })
);

export async function showDepartmentsById(id: string) {
	const res = await fetch(`${base}/api/creator/departments/${id}`);
	if (!res.ok) {
		throw await res.json();
	}
	const department: Department = departmentFromJSON(await res.json());
	departmentsWritable.update((state) => addOrUpdate(state, department));
	return department;
}

export async function showDepartments() {
	const res = await fetch(`${base}/api/creator/departments`);
	if (!res.ok) {
		throw await res.json();
	}
	const departments: Department[] = (await res.json()).map(departmentFromJSON);
	departmentsWritable.update((state) =>
		departments.reduce((state, department) => addOrUpdate(state, department), state)
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
	departmentsWritable.update((state) => addOrUpdate(state, department));
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
	departmentsWritable.update((departments) => addOrUpdate(departments, department));
	return department;
}

export async function deleteDepartment(id: string) {
	const res = await fetch(`${base}/api/creator/departments/${id}`, {
		method: 'DELETE'
	});
	if (!res.ok) {
		throw await res.json();
	}
	departmentsWritable.update((departments) => {
		const index = departments.findIndex((department) => department.id === id);
		if (index !== -1) {
			departments.splice(index, 1);
		}
		return departments;
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
