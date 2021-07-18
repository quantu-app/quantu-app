import { Journel, JournelService, User } from '$lib/api/quantu-app-api';
import type { Readable } from 'svelte/store';
import { get, writable } from 'svelte/store';
import { isOnline } from './online';
import { LocalJSON } from './LocalJSON';
import { getCurrentUser, isSignedIn, userEmitter } from './user';
import { getLocationName, isEmptyObject } from '$lib/utils';
import { deepEqual } from 'fast-equals';

const journelsLocal = new LocalJSON<Journel>('journels'),
	journelsWritable = writable<Record<string, Journel>>({});

export const journels: Readable<Record<string, Journel>> = {
	subscribe: journelsWritable.subscribe
};

export async function createJournel(name: string) {
	const journel: Journel = {
		...emptyJournel(),
		name,
		userId: isSignedIn() ? getCurrentUser().id : null,
		location: await getLocationName()
	};

	if (isOnline() && isSignedIn()) {
		Object.assign(journel, await JournelService.quantuAppWebControllerJournelCreate(journel));
	}

	const localId = await journelsLocal.createTableId();
	journelsWritable.update((state) => {
		state[localId] = journel;
		return state;
	});
	await journelsLocal.set(localId, journel);
	return [localId, journel];
}

export async function updateJournel(localId: string, updates: Partial<Journel>) {
	const oldJournel = get(journelsWritable)[localId] || emptyJournel(),
		journel = { ...oldJournel, ...updates, updatedAt: new Date().toJSON() };

	if (oldJournel.id && isOnline() && isSignedIn()) {
		Object.assign(
			journel,
			await JournelService.quantuAppWebControllerJournelUpdate(oldJournel.id, updates)
		);
	}

	journelsWritable.update((state) => {
		state[localId] = journel;
		return state;
	});
	await journelsLocal.set(localId, journel);
	return journel;
}

export async function deleteJournel(localId: string) {
	const journel = get(journelsWritable)[localId] || emptyJournel();

	if (journel.id && isOnline() && isSignedIn()) {
		await JournelService.quantuAppWebControllerJournelDelete(journel.id);
	}
	journelsWritable.update((state) => {
		delete state[localId];
		return state;
	});
	await journelsLocal.remove(localId);
}

function emptyJournel(): Journel {
	return {
		id: null,
		content: [],
		location: '',
		language: 'en',
		name: null,
		tags: [],
		userId: null,
		wordCount: 0,
		insertedAt: new Date().toJSON(),
		updatedAt: new Date().toJSON()
	};
}

let syncing = false;
async function syncJournels(localJournelsByLocalId: Record<string, Journel>, _user: User) {
	if (syncing) {
		return;
	}
	syncing = true;
	try {
		const serverJournels = await JournelService.quantuAppWebControllerJournelIndex(),
			serverJournelsById = serverJournels.reduce<Record<string, Journel>>((byId, journel) => {
				byId[journel.id] = journel;
				return byId;
			}, {}),
			localJournelsById: Record<string, [string, Journel]> = {},
			localJournelsToCreateByLocalId: [string, Journel][] = [],
			localJournelsToDeleteById: [string, Journel][] = [],
			promises: Promise<[string, Journel, boolean]>[] = [];

		Object.entries(localJournelsByLocalId).forEach(([localId, journel]) => {
			if (journel.id) {
				if (serverJournelsById[journel.id]) {
					localJournelsById[journel.id] = [localId, journel];
				} else {
					localJournelsToDeleteById.push([localId, journel]);
				}
			} else {
				localJournelsToCreateByLocalId.push([localId, journel]);
			}
		});

		serverJournels.forEach((serverJournel) => {
			const localEntry = localJournelsById[serverJournel.id];

			if (localEntry) {
				const [localId, localJournel] = localEntry,
					serverUpdatedAt = new Date(serverJournel.updatedAt),
					localUpdatedAt = new Date(localJournel.updatedAt);

				if (serverUpdatedAt !== localUpdatedAt) {
					const isServerUpdate = serverUpdatedAt > localUpdatedAt,
						requestBody = isServerUpdate
							? journelChanges(localJournel, serverJournel)
							: journelChanges(serverJournel, localJournel);

					if (isEmptyObject(requestBody)) {
						journelsLocal.set(localId, isServerUpdate ? serverJournel : localJournel);
						promises.push(
							Promise.resolve([localId, isServerUpdate ? serverJournel : localJournel, true])
						);
					} else {
						promises.push(
							JournelService.quantuAppWebControllerJournelUpdate(
								serverJournel.id,
								requestBody
							).then((journel) =>
								journelsLocal.set(localId, journel).then(() => [localId, journel, true])
							)
						);
					}
				}
			} else {
				promises.push(
					journelsLocal
						.createTableId()
						.then((localId) =>
							journelsLocal.set(localId, serverJournel).then(() => [localId, serverJournel, true])
						)
				);
			}
		});

		localJournelsToCreateByLocalId.forEach(([localId, localJournel]) => {
			promises.push(
				JournelService.quantuAppWebControllerJournelCreate(localJournel).then((journel) =>
					journelsLocal.set(localId, journel).then(() => [localId, journel, true])
				)
			);
		});
		localJournelsToDeleteById.forEach(([localId, journel]) => {
			promises.push(journelsLocal.remove(localId).then(() => [localId, journel, false]));
		});

		const journelUpdates = await Promise.all(promises);

		journelsWritable.update((state) =>
			journelUpdates.reduce((state, [localId, journel, add]) => {
				if (add) {
					state[localId] = journel;
				} else {
					delete state[localId];
				}
				return state;
			}, state)
		);
	} finally {
		syncing = false;
	}
}

function journelChanges(prev: Journel, next: Journel) {
	const updates: Partial<Journel> = {};
	if (prev.name !== next.name) {
		updates.name = next.name;
	}
	if (prev.location !== next.location) {
		updates.location = next.location;
	}
	if (prev.wordCount !== next.wordCount) {
		updates.wordCount = next.wordCount;
	}
	if (prev.language !== next.language) {
		updates.language = next.language;
	}
	if (!deepEqual(prev.tags, next.tags)) {
		updates.tags = next.tags;
	}
	if (deepEqual(prev.content, next.content)) {
		updates.content = next.content;
	}
	return updates;
}

if (typeof window === 'object') {
	userEmitter.on('signIn', (user) =>
		journelsLocal.all().then((localJournels) => syncJournels(localJournels, user))
	);

	journelsLocal.all().then((journels) => {
		journelsWritable.update((state) =>
			Object.entries(journels).reduce(
				(state, [localId, journel]) => ({
					...state,
					[localId]: journel
				}),
				state
			)
		);
		if (isSignedIn()) {
			syncJournels(journels, getCurrentUser());
		}
	});
}
