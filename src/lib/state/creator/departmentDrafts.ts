import type { DepartmentDraft } from '@prisma/client';
import { writable, derived } from 'svelte/store';
import { base } from '$app/paths';
import type { IFetch } from '$lib/utils';
import { addDepartment, departmentFromJSON, type StateDepartment } from './departments';

export type StateDepartmentDraft = DepartmentDraft & {
	creator: {
		id: string;
		username: string;
	};
	departmentRef?: {
		id: string;
		name: string;
		url: string;
	};
};

const departmentDraftsWritable = writable<DepartmentDraft[]>([]);

export const departmentDrafts = derived(
	departmentDraftsWritable,
	(departmentDrafts) => departmentDrafts
);

export const departmentDraftsById = derived(departmentDraftsWritable, (departmentDrafts) =>
	departmentDrafts.reduce((byId, departmentDraft) => {
		byId[departmentDraft.id] = departmentDraft;
		return byId;
	}, {} as { [id: string]: DepartmentDraft })
);

export const departmentDraftsByReferenceId = derived(departmentDraftsWritable, (departmentDrafts) =>
	departmentDrafts.reduce((byReferenceId, departmentDraft) => {
		if (departmentDraft.departmentRefId) {
			byReferenceId[departmentDraft.departmentRefId] = departmentDraft;
		}
		return byReferenceId;
	}, {} as { [departmentRefId: string]: DepartmentDraft })
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
	const departmentDraft: DepartmentDraft = departmentDraftFromJSON(await res.json());
	departmentDraftsWritable.update((state) => addOrUpdate(state.slice(), departmentDraft));
	return departmentDraft;
}

export async function showDepartmentDrafts(
	merged: boolean | null = false,
	fetchFn: IFetch = fetch
) {
	console.log('state', merged);
	const res = await fetchFn(
		`${base}/api/creator/drafts/departments${merged === null ? '' : `?merged=${merged}`}`,
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
	if (!res.ok) {
		throw await res.json();
	}
	const departmentDrafts: DepartmentDraft[] = (await res.json()).map(departmentDraftFromJSON);
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
	const departmentDraft: DepartmentDraft = departmentDraftFromJSON(await res.json());
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
	const departmentDraft: DepartmentDraft = departmentDraftFromJSON(await res.json());
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
	const departmentDraft: DepartmentDraft = departmentDraftFromJSON(await res.json());
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
	const department: StateDepartment = departmentFromJSON(await res.json());
	departmentDraftsWritable.update((state) => {
		const index = state.findIndex((t) => t.id === id);
		const departmentDraft = state[index];
		if (departmentDraft) {
			state = state.slice();
			state[index] = { ...departmentDraft, merged: true };
		}
		return state;
	});
	addDepartment(department);
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
	departmentDrafts: DepartmentDraft[],
	departmentDraft: DepartmentDraft
): DepartmentDraft[] {
	const index = departmentDrafts.findIndex((t) => t.id === departmentDraft.id);
	if (index === -1) {
		departmentDrafts.push(departmentDraft);
	} else {
		departmentDrafts[index] = departmentDraft;
	}
	return departmentDrafts;
}

function departmentDraftFromJSON(departmentDraft: DepartmentDraft): DepartmentDraft {
	return {
		...departmentDraft,
		createdAt: new Date(departmentDraft.createdAt),
		updatedAt: new Date(departmentDraft.updatedAt)
	};
}
