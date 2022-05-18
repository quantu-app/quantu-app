import type { DepartmentDraft, DepartmentDraftApproval } from '@prisma/client';
import { writable, derived } from 'svelte/store';
import { base } from '$app/paths';
import type { IFetch } from '$lib/utils';
import { addDepartment, departmentFromJSON, type StateDepartment } from './departments';

export type StateDepartmentDraft = DepartmentDraft & {
	approvals: DepartmentDraftApproval[];
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

const departmentDraftsWritable = writable<StateDepartmentDraft[]>([]);

export const departmentDrafts = derived(
	departmentDraftsWritable,
	(departmentDrafts) => departmentDrafts
);

export const departmentDraftsById = derived(departmentDraftsWritable, (departmentDrafts) =>
	departmentDrafts.reduce((byId, departmentDraft) => {
		byId[departmentDraft.id] = departmentDraft;
		return byId;
	}, {} as { [id: string]: StateDepartmentDraft })
);

export const departmentDraftsByReferenceId = derived(departmentDraftsWritable, (departmentDrafts) =>
	departmentDrafts.reduce((byReferenceId, departmentDraft) => {
		if (departmentDraft.departmentRefId) {
			byReferenceId[departmentDraft.departmentRefId] = departmentDraft;
		}
		return byReferenceId;
	}, {} as { [departmentRefId: string]: StateDepartmentDraft })
);

export async function showDepartmentDraftById(id: string, fetchFn: IFetch = fetch) {
	const res = await fetchFn(`${base}/api/creator/drafts/departments/${id}`, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok) {
		throw await res.json();
	}
	const departmentDraft: StateDepartmentDraft = departmentDraftFromJSON(await res.json());
	departmentDraftsWritable.update((state) => addOrUpdate(state.slice(), departmentDraft));
	return departmentDraft;
}

export async function showDepartmentDrafts(fetchFn: IFetch = fetch) {
	const res = await fetchFn(`${base}/api/creator/drafts/departments`, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok) {
		throw await res.json();
	}
	const departmentDrafts: StateDepartmentDraft[] = (await res.json()).map(departmentDraftFromJSON);
	departmentDraftsWritable.update((state) =>
		departmentDrafts.reduce(
			(state, departmentDraft) => addOrUpdate(state, departmentDraft),
			state.slice()
		)
	);
	return departmentDrafts;
}

export async function createDepartmentDraft(body: Partial<DepartmentDraft>) {
	const res = await fetch(`${base}/api/creator/drafts/departments`, {
		method: 'POST',
		body: JSON.stringify(body)
	});
	if (!res.ok) {
		throw await res.json();
	}
	const departmentDraft: StateDepartmentDraft = departmentDraftFromJSON(await res.json());
	departmentDraftsWritable.update((state) => addOrUpdate(state.slice(), departmentDraft));
	return departmentDraft;
}

export async function createDepartmentDraftFromRef(departmentId: string) {
	const res = await fetch(`${base}/api/creator/drafts/departments/from/${departmentId}`, {
		method: 'POST'
	});
	if (!res.ok) {
		throw await res.json();
	}
	const departmentDraft: StateDepartmentDraft = departmentDraftFromJSON(await res.json());
	departmentDraftsWritable.update((state) => addOrUpdate(state.slice(), departmentDraft));
	return departmentDraft;
}

export async function updateDepartmentDraft(id: string, body: Partial<DepartmentDraft>) {
	const res = await fetch(`${base}/api/creator/drafts/departments/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(body)
	});
	if (!res.ok) {
		throw await res.json();
	}
	const departmentDraft: StateDepartmentDraft = departmentDraftFromJSON(await res.json());
	departmentDraftsWritable.update((state) => addOrUpdate(state.slice(), departmentDraft));
	return departmentDraft;
}

export async function mergeDepartmentDraft(id: string) {
	const res = await fetch(`${base}/api/creator/drafts/departments/${id}/merge`, {
		method: 'PATCH'
	});
	if (!res.ok) {
		throw await res.json();
	}
	departmentDraftsWritable.update((state) => {
		const index = state.findIndex((departmentDraft) => departmentDraft.id === id);
		if (index !== -1) {
			state = state.slice();
			state.splice(index, 1);
		}
		return state;
	});
	const department: StateDepartment = departmentFromJSON(await res.json());
	addDepartment(department);
	return department;
}

export async function approveDepartmentDraft(id: string) {
	const res = await fetch(`${base}/api/creator/drafts/departments/${id}/approve`, {
		method: 'PATCH'
	});
	if (!res.ok) {
		throw await res.json();
	}
	const departmentDraftApproval: DepartmentDraftApproval = departmentDraftApprovalFromJSON(
		await res.json()
	);
	departmentDraftsWritable.update((state) => {
		const index = state.findIndex(
			(departmentDraft) => departmentDraft.id === departmentDraftApproval.departmentDraftId
		);
		const departmentDraft = state[index];
		if (departmentDraft) {
			const approvals = departmentDraft.approvals.slice();
			const approvalIndex = approvals.findIndex(
				(approval) => approval.id === departmentDraftApproval.id
			);
			if (approvalIndex === -1) {
				approvals.push(departmentDraftApproval);
			} else {
				approvals[approvalIndex] = departmentDraftApproval;
			}
			state = state.slice();
			state[index] = { ...departmentDraft, approvals };
		}
		return state;
	});
	return departmentDraftApproval;
}

export async function deleteDepartmentDraft(id: string) {
	const res = await fetch(`${base}/api/creator/drafts/departments/${id}`, {
		method: 'DELETE'
	});
	if (!res.ok) {
		throw await res.json();
	}
	departmentDraftsWritable.update((state) => {
		const index = state.findIndex((departmentDraft) => departmentDraft.id === id);
		if (index !== -1) {
			state = state.slice();
			state.splice(index, 1);
		}
		return state;
	});
}

function addOrUpdate(
	departmentDrafts: StateDepartmentDraft[],
	departmentDraft: StateDepartmentDraft
): StateDepartmentDraft[] {
	const index = departmentDrafts.findIndex((t) => t.id === departmentDraft.id);
	if (index === -1) {
		departmentDrafts.push(departmentDraft);
	} else {
		departmentDrafts[index] = departmentDraft;
	}
	return departmentDrafts;
}

function departmentDraftFromJSON(departmentDraft: StateDepartmentDraft): StateDepartmentDraft {
	return {
		...departmentDraft,
		approvals: departmentDraft.approvals.map(departmentDraftApprovalFromJSON),
		createdAt: new Date(departmentDraft.createdAt),
		updatedAt: new Date(departmentDraft.updatedAt)
	};
}

function departmentDraftApprovalFromJSON(
	departmentDraftApproval: DepartmentDraftApproval
): DepartmentDraftApproval {
	return {
		...departmentDraftApproval,
		createdAt: new Date(departmentDraftApproval.createdAt),
		updatedAt: new Date(departmentDraftApproval.updatedAt)
	};
}
