import type { Change, ChangeType } from '@prisma/client';
import { writable, derived } from 'svelte/store';
import { base } from '$app/paths';
import { createQueryParams, type IFetch } from '$lib/utils';

export type StateChange = Change & {
	user: {
		id: string;
		username: string;
	};
};

const changesWritable = writable<StateChange[]>([]);

export const changes = derived(changesWritable, (changes) => changes);

export const changesById = derived(changesWritable, (changes) =>
	changes.reduce((byId, change) => {
		byId[change.id] = change;
		return byId;
	}, {} as { [id: string]: StateChange })
);

export const changesByReferenceTypeAndReferenceId = derived(changesWritable, (changes) =>
	changes.reduce((state, change) => {
		const byReferenceType = state[change.referenceType] || (state[change.referenceType] = {});
		const byReferenceId =
			byReferenceType[change.referenceId] || (byReferenceType[change.referenceId] = []);
		byReferenceId.push(change);
		return state;
	}, {} as { [referenceType: string]: { [referenceId: string]: StateChange[] } })
);

export async function showChangeById(id: string, fetchFn: IFetch = fetch) {
	const res = await fetchFn(`${base}/api/creator/changes/${id}`, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok) {
		throw await res.json();
	}
	const change: StateChange = changeFromJSON(await res.json());
	changesWritable.update((state) => addOrUpdate(state.slice(), change));
	return change;
}

export async function showChanges(
	referenceType: ChangeType,
	referenceId: string | null,
	currentUser: boolean,
	fetchFn: IFetch = fetch
) {
	const res = await fetchFn(
		`${base}/api/creator/changes${createQueryParams({
			referenceType,
			referenceId,
			latest: 'true',
			currentUser: currentUser ? 'true' : undefined
		})}`,
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
	if (!res.ok) {
		throw await res.json();
	}
	const changes: StateChange[] = (await res.json()).map(changeFromJSON);
	changesWritable.update((state) =>
		changes.reduce((state, change) => addOrUpdate(state, change), state.slice())
	);
	return changes;
}

export async function showChangesByIds(ids: string[], fetchFn: IFetch = fetch) {
	const res = await fetchFn(`${base}/api/creator/changes${createQueryParams({ ids })}`, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok) {
		throw await res.json();
	}
	const changes: StateChange[] = (await res.json()).map(changeFromJSON);
	changesWritable.update((state) =>
		changes.reduce((state, change) => addOrUpdate(state, change), state.slice())
	);
	return changes;
}

export async function createChange(
	referenceType: ChangeType,
	referenceId: string | null,
	body: Change['value']
) {
	const res = await fetch(
		`${base}/api/creator/changes${createQueryParams({
			referenceType,
			referenceId
		})}`,
		{
			method: 'POST',
			body: JSON.stringify(body)
		}
	);
	if (!res.ok) {
		throw await res.json();
	}
	const change: StateChange = changeFromJSON(await res.json());
	changesWritable.update((state) => addOrUpdate(state.slice(), change));
	return change;
}

export async function updateChange(id: string, body: Change['value']) {
	const res = await fetch(`${base}/api/creator/changes/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(body)
	});
	if (!res.ok) {
		throw await res.json();
	}
	const change: StateChange = changeFromJSON(await res.json());
	changesWritable.update((state) => addOrUpdate(state.slice(), change));
	return change;
}

function addOrUpdate(changes: StateChange[], change: StateChange): StateChange[] {
	const index = changes.findIndex((t) => t.id === change.id);
	if (index === -1) {
		changes.push(change);
	} else {
		changes[index] = change;
	}
	return changes;
}

function changeFromJSON(change: StateChange): StateChange {
	return {
		...change,
		createdAt: new Date(change.createdAt),
		updatedAt: new Date(change.updatedAt)
	};
}
