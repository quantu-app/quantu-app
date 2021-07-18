import { Journel, JournelService, User } from '$lib/api/quantu-app-api';
import type { Readable } from 'svelte/store';
import { get, writable } from 'svelte/store';
import { isOnline } from './online';
import { LocalJSON } from './LocalJSON';
import { getCurrentUser, isSignedIn, userEmitter } from './user';
import { getLocationName, isEmptyObject } from '$lib/utils';
import { deepEqual } from 'fast-equals';
import EventEmitter from 'eventemitter3';

const journelsLocal = new LocalJSON<Journel>('journels'),
	journelsWritable = writable<Record<string, Journel>>({});

export const journelEmitter = new EventEmitter<{ sync: () => void }>();

export const journels: Readable<Record<string, Journel>> = {
	subscribe: journelsWritable.subscribe
};

export async function createJournel(name: string) {
	const journel: Journel = {
		...emptyJournel(),
		name,
		userId: isSignedIn() ? getCurrentUser().id : null,
		location: isOnline() ? await getLocationName() : 'Unknown'
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
	const journel = get(journelsWritable)[localId];

	if (journel?.id && isOnline() && isSignedIn()) {
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
		language: 'English',
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
			localJournelsToCreate: [string, Journel][] = [],
			localJournelsToDelete: [string, Journel][] = [],
			promises: Promise<[localId: string, journel: Journel, remove?: boolean]>[] = [];

		Object.entries(localJournelsByLocalId).forEach(([localId, localJournel]) => {
			if (localJournel.id && localJournel.userId) {
				if (serverJournelsById[localJournel.id]) {
					localJournelsById[localJournel.id] = [localId, localJournel];
				} else {
					localJournelsToDelete.push([localId, localJournel]);
				}
			} else {
				localJournelsToCreate.push([localId, localJournel]);
			}
		});

		serverJournels.forEach((serverJournel) => {
			const localEntry = localJournelsById[serverJournel.id];

			if (localEntry) {
				const [localId, localJournel] = localEntry;

				if (serverJournel.updatedAt !== localJournel.updatedAt) {
					const serverUpdatedAt = new Date(serverJournel.updatedAt),
						localUpdatedAt = new Date(localJournel.updatedAt);

					if (serverUpdatedAt > localUpdatedAt) {
						promises.push(
							journelsLocal.set(localId, serverJournel).then(() => [localId, serverJournel])
						);
					} else {
						const requestBody = journelChanges(serverJournel, localJournel);

						if (!isEmptyObject(requestBody)) {
							promises.push(
								JournelService.quantuAppWebControllerJournelUpdate(
									serverJournel.id,
									requestBody
								).then((journel) =>
									journelsLocal.set(localId, journel).then(() => [localId, journel])
								)
							);
						}
					}
				}
			} else {
				promises.push(
					journelsLocal
						.createTableId()
						.then((localId) =>
							journelsLocal.set(localId, serverJournel).then(() => [localId, serverJournel])
						)
				);
			}
		});

		localJournelsToCreate.forEach(([localId, localJournel]) => {
			promises.push(
				JournelService.quantuAppWebControllerJournelCreate(localJournel).then((journel) =>
					journelsLocal.set(localId, journel).then(() => [localId, journel])
				)
			);
		});
		localJournelsToDelete.forEach(([localId, journel]) => {
			promises.push(journelsLocal.remove(localId).then(() => [localId, journel, true]));
		});

		const journelUpdates = await Promise.all(promises);

		journelsWritable.update((state) =>
			journelUpdates.reduce((state, [localId, journel, remove]) => {
				if (remove) {
					delete state[localId];
				} else {
					state[localId] = journel;
				}
				return state;
			}, state)
		);
	} finally {
		syncing = false;
		journelEmitter.emit('sync');
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
	if (!deepEqual(prev.content, next.content)) {
		updates.content = next.content;
	}
	return updates;
}

if (typeof window === 'object') {
	userEmitter.on('signIn', (user) =>
		journelsLocal
			.all((journel) => journel.userId === user.id || !journel.userId)
			.then((localJournels) => syncJournels(localJournels, user))
	);

	journelsLocal.all().then((journels) => {
		const user = getCurrentUser();

		Object.entries(journels).forEach(([localId, journel]) => {
			if (journel.userId && user && journel.userId !== user.id) {
				delete journels[localId];
			}
		});

		journelsWritable.update((state) =>
			Object.entries(journels).reduce((state, [localId, journel]) => {
				state[localId] = journel;
				return state;
			}, state)
		);
		if (user) {
			syncJournels(journels, user);
		}
	});
}
