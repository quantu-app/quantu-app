import type { DepartmentChange, DepartmentChangeApproval } from '@prisma/client';
import { writable, derived } from 'svelte/store';
import { base } from '$app/paths';
import type { IFetch } from '$lib/utils';
import { addDepartment, departmentFromJSON, type StateDepartment } from './departments';

export type StateDepartmentChange = DepartmentChange & {
	approvals: DepartmentChangeApproval[];
	user: {
		id: string;
		username: string;
	};
	departmentRef?: {
		id: string;
		name: string;
		url: string;
	};
};

const departmentChangesWritable = writable<StateDepartmentChange[]>([]);

export const departmentChanges = derived(
	departmentChangesWritable,
	(departmentChanges) => departmentChanges
);

export const departmentChangesById = derived(departmentChangesWritable, (departmentChanges) =>
	departmentChanges.reduce((byId, departmentChange) => {
		byId[departmentChange.id] = departmentChange;
		return byId;
	}, {} as { [id: string]: StateDepartmentChange })
);

export const departmentChangesByReferenceId = derived(
	departmentChangesWritable,
	(departmentChanges) =>
		departmentChanges.reduce((byReferenceId, departmentChange) => {
			if (departmentChange.departmentRefId) {
				byReferenceId[departmentChange.departmentRefId] = departmentChange;
			}
			return byReferenceId;
		}, {} as { [departmentRefId: string]: StateDepartmentChange })
);

export async function showDepartmentChangeById(id: string, fetchFn: IFetch = fetch) {
	const res = await fetchFn(`${base}/api/creator/changes/departments/${id}`, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok) {
		throw await res.json();
	}
	const departmentChange: StateDepartmentChange = departmentChangeFromJSON(await res.json());
	departmentChangesWritable.update((state) => addOrUpdate(state.slice(), departmentChange));
	return departmentChange;
}

export async function showDepartmentChanges(fetchFn: IFetch = fetch) {
	const res = await fetchFn(`${base}/api/creator/changes/departments`, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok) {
		throw await res.json();
	}
	const departmentChanges: StateDepartmentChange[] = (await res.json()).map(
		departmentChangeFromJSON
	);
	departmentChangesWritable.update((state) =>
		departmentChanges.reduce(
			(state, departmentChange) => addOrUpdate(state, departmentChange),
			state.slice()
		)
	);
	return departmentChanges;
}

export async function createDepartmentChange(body: Partial<DepartmentChange>) {
	const res = await fetch(`${base}/api/creator/changes/departments`, {
		method: 'POST',
		body: JSON.stringify(body)
	});
	if (!res.ok) {
		throw await res.json();
	}
	const departmentChange: StateDepartmentChange = departmentChangeFromJSON(await res.json());
	departmentChangesWritable.update((state) => addOrUpdate(state.slice(), departmentChange));
	return departmentChange;
}

export async function createDepartmentChangeFromRef(departmentId: string) {
	const res = await fetch(`${base}/api/creator/changes/departments/from/${departmentId}`, {
		method: 'POST'
	});
	if (!res.ok) {
		throw await res.json();
	}
	const departmentChange: StateDepartmentChange = departmentChangeFromJSON(await res.json());
	departmentChangesWritable.update((state) => addOrUpdate(state.slice(), departmentChange));
	return departmentChange;
}

export async function updateDepartmentChange(id: string, body: Partial<DepartmentChange>) {
	const res = await fetch(`${base}/api/creator/changes/departments/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(body)
	});
	if (!res.ok) {
		throw await res.json();
	}
	const departmentChange: StateDepartmentChange = departmentChangeFromJSON(await res.json());
	departmentChangesWritable.update((state) => addOrUpdate(state.slice(), departmentChange));
	return departmentChange;
}

export async function mergeDepartmentChange(id: string) {
	const res = await fetch(`${base}/api/creator/changes/departments/${id}/merge`, {
		method: 'PATCH'
	});
	if (!res.ok) {
		throw await res.json();
	}
	const { department: departmentJSON, departmentChange: departmentChangeJSON } = await res.json();
	const department: StateDepartment = departmentFromJSON(departmentJSON);
	const departmentChange: StateDepartmentChange = departmentChangeFromJSON(departmentChangeJSON);
	addDepartment(department);
	departmentChangesWritable.update((state) => addOrUpdate(state.slice(), departmentChange));
	return { department, departmentChange };
}

export async function approveDepartmentChange(id: string) {
	const res = await fetch(`${base}/api/creator/changes/departments/${id}/approve`, {
		method: 'PATCH'
	});
	if (!res.ok) {
		throw await res.json();
	}
	const departmentChangeApproval: DepartmentChangeApproval = departmentChangeApprovalFromJSON(
		await res.json()
	);
	departmentChangesWritable.update((state) => {
		const index = state.findIndex(
			(departmentChange) => departmentChange.id === departmentChangeApproval.departmentChangeId
		);
		const departmentChange = state[index];
		if (departmentChange) {
			const approvals = departmentChange.approvals.slice();
			const approvalIndex = approvals.findIndex(
				(approval) => approval.id === departmentChangeApproval.id
			);
			if (approvalIndex === -1) {
				approvals.push(departmentChangeApproval);
			} else {
				approvals[approvalIndex] = departmentChangeApproval;
			}
			state = state.slice();
			state[index] = { ...departmentChange, approvals };
		}
		return state;
	});
	return departmentChangeApproval;
}

export async function deleteDepartmentChange(id: string) {
	const res = await fetch(`${base}/api/creator/changes/departments/${id}`, {
		method: 'DELETE'
	});
	if (!res.ok) {
		throw await res.json();
	}
	departmentChangesWritable.update((state) => {
		const index = state.findIndex((departmentChange) => departmentChange.id === id);
		if (index !== -1) {
			state = state.slice();
			state.splice(index, 1);
		}
		return state;
	});
}

function addOrUpdate(
	departmentChanges: StateDepartmentChange[],
	departmentChange: StateDepartmentChange
): StateDepartmentChange[] {
	const index = departmentChanges.findIndex((t) => t.id === departmentChange.id);
	if (index === -1) {
		departmentChanges.push(departmentChange);
	} else {
		departmentChanges[index] = departmentChange;
	}
	return departmentChanges;
}

function departmentChangeFromJSON(departmentChange: StateDepartmentChange): StateDepartmentChange {
	return {
		...departmentChange,
		approvals: departmentChange.approvals.map(departmentChangeApprovalFromJSON),
		createdAt: new Date(departmentChange.createdAt),
		updatedAt: new Date(departmentChange.updatedAt)
	};
}

function departmentChangeApprovalFromJSON(
	departmentChangeApproval: DepartmentChangeApproval
): DepartmentChangeApproval {
	return {
		...departmentChangeApproval,
		createdAt: new Date(departmentChangeApproval.createdAt),
		updatedAt: new Date(departmentChangeApproval.updatedAt)
	};
}
