import { Journal, JournalService, User } from '$lib/api/quantu-app-api';
import type { Readable } from 'svelte/store';
import { get, writable } from 'svelte/store';
import { isOnline } from './online';
import { LocalJSON } from './LocalJSON';
import { getCurrentUser, isSignedIn, userEmitter } from './user';
import { getLocationName, isEmptyObject } from '$lib/utils';
import { deepEqual } from 'fast-equals';
import EventEmitter from 'eventemitter3';

const journalsLocal = new LocalJSON<Journal>('journals'),
	journalsWritable = writable<Record<string, Journal>>({});

export const journalEmitter = new EventEmitter<{ sync: () => void }>();

export const journals: Readable<Record<string, Journal>> = {
	subscribe: journalsWritable.subscribe
};

export async function createJournal(name: string) {
	const journal: Journal = {
		...emptyJournal(),
		name,
		userId: isSignedIn() ? getCurrentUser().id : null,
		location: isOnline() ? await getLocationName() : 'Unknown'
	};

	if (isOnline() && isSignedIn()) {
		Object.assign(journal, await JournalService.quantuAppWebControllerJournalCreate(journal));
	}

	const localId = await journalsLocal.createTableId();
	journalsWritable.update((state) => {
		state[localId] = journal;
		return state;
	});
	await journalsLocal.set(localId, journal);
	return [localId, journal];
}

export async function updateJournal(localId: string, updates: Partial<Journal>) {
	const oldJournal = get(journalsWritable)[localId] || emptyJournal(),
		journal = { ...oldJournal, ...updates, updatedAt: new Date().toJSON() };

	if (oldJournal.id && isOnline() && isSignedIn()) {
		Object.assign(
			journal,
			await JournalService.quantuAppWebControllerJournalUpdate(oldJournal.id, updates)
		);
	}

	journalsWritable.update((state) => {
		state[localId] = journal;
		return state;
	});
	await journalsLocal.set(localId, journal);
	return journal;
}

export async function deleteJournal(localId: string) {
	const journal = get(journalsWritable)[localId];

	if (journal?.id && isOnline() && isSignedIn()) {
		await JournalService.quantuAppWebControllerJournalDelete(journal.id);
	}
	journalsWritable.update((state) => {
		delete state[localId];
		return state;
	});
	await journalsLocal.remove(localId);
}

function emptyJournal(): Journal {
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
async function syncJournals(localJournalsByLocalId: Record<string, Journal>) {
	if (syncing) {
		return;
	}
	syncing = true;
	try {
		const serverJournals = await JournalService.quantuAppWebControllerJournalIndex(),
			serverJournalsById = serverJournals.reduce<Record<string, Journal>>((byId, journal) => {
				byId[journal.id] = journal;
				return byId;
			}, {}),
			localJournalsById: Record<string, [string, Journal]> = {},
			localJournalsToCreate: [string, Journal][] = [],
			localJournalsToDelete: [string, Journal][] = [],
			promises: Promise<[localId: string, journal: Journal, remove?: boolean]>[] = [];

		Object.entries(localJournalsByLocalId).forEach(([localId, localJournal]) => {
			if (localJournal.id && localJournal.userId) {
				if (serverJournalsById[localJournal.id]) {
					localJournalsById[localJournal.id] = [localId, localJournal];
				} else {
					localJournalsToDelete.push([localId, localJournal]);
				}
			} else {
				localJournalsToCreate.push([localId, localJournal]);
			}
		});

		serverJournals.forEach((serverJournal) => {
			const localEntry = localJournalsById[serverJournal.id];

			if (localEntry) {
				const [localId, localJournal] = localEntry;

				if (serverJournal.updatedAt !== localJournal.updatedAt) {
					const serverUpdatedAt = new Date(serverJournal.updatedAt),
						localUpdatedAt = new Date(localJournal.updatedAt);

					if (serverUpdatedAt > localUpdatedAt) {
						promises.push(
							journalsLocal.set(localId, serverJournal).then(() => [localId, serverJournal])
						);
					} else {
						const requestBody = journalChanges(serverJournal, localJournal);

						if (!isEmptyObject(requestBody)) {
							promises.push(
								JournalService.quantuAppWebControllerJournalUpdate(
									serverJournal.id,
									requestBody
								).then((updatedJournal) =>
									journalsLocal.set(localId, updatedJournal).then(() => [localId, updatedJournal])
								)
							);
						}
					}
				} else {
					promises.push(
						journalsLocal.set(localId, serverJournal).then(() => [localId, serverJournal])
					);
				}
			} else {
				promises.push(
					journalsLocal
						.createTableId()
						.then((localId) =>
							journalsLocal.set(localId, serverJournal).then(() => [localId, serverJournal])
						)
				);
			}
		});

		localJournalsToCreate.forEach(([localId, localJournal]) => {
			promises.push(
				JournalService.quantuAppWebControllerJournalCreate(localJournal).then((journal) =>
					journalsLocal.set(localId, journal).then(() => [localId, journal])
				)
			);
		});
		localJournalsToDelete.forEach(([localId, journal]) => {
			promises.push(journalsLocal.remove(localId).then(() => [localId, journal, true]));
		});

		const journalUpdates = await Promise.all(promises);

		journalsWritable.update((state) =>
			journalUpdates.reduce((state, [localId, journal, remove]) => {
				if (remove) {
					delete state[localId];
				} else {
					state[localId] = journal;
				}
				return state;
			}, state)
		);

		const allIds = new Set(await journalsLocal.getIds()),
			activeIds = new Set(Object.keys(get(journalsWritable)));

		for (const id of activeIds) {
			allIds.delete(id);
		}

		await Promise.all([...allIds].map((id) => journalsLocal.remove(id)));
	} finally {
		syncing = false;
		journalEmitter.emit('sync');
	}
}

function journalChanges(prev: Journal, next: Journal) {
	const updates: Partial<Journal> = {};
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
		journalsLocal
			.all((journal) => journal.userId === user.id || !journal.userId)
			.then((localJournals) => syncJournals(localJournals))
	);
	userEmitter.on('signOut', () =>
		journalsLocal
			.all((journal) => !journal.userId)
			.then((localJournals) =>
				journalsWritable.update(() =>
					Object.entries(localJournals).reduce((state, [localId, journal]) => {
						state[localId] = journal;
						return state;
					}, {})
				)
			)
	);

	journalsLocal.all().then((journals) => {
		const user = getCurrentUser();

		Object.entries(journals).forEach(([localId, journal]) => {
			if (user ? journal.userId !== user.id : journal.userId) {
				delete journals[localId];
			}
		});

		journalsWritable.update(() =>
			Object.entries(journals).reduce((state, [localId, journal]) => {
				state[localId] = journal;
				return state;
			}, {})
		);

		if (user) {
			syncJournals(journals);
		}
	});
}
