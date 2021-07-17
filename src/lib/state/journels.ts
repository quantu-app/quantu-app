import { Journel, JournelService } from '$lib/api/quantu-app-api';
import type { Readable } from 'svelte/store';
import { get, writable } from 'svelte/store';
import { isOnline, onlineEmitter } from './online';
import { LocalJSON } from './LocalJSON';
import { getCurrentUser, isSignedIn, userEmitter } from './user';
import { getLocationName } from '$lib/utils';

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
		Object.assign(journel, await JournelService.quantuAppWebControllerJournelCreate({ name }));
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

async function syncJournels() {
	// const [serverJournels, localJournels] = await Promise.all([
	// 	JournelService.quantuAppWebControllerJournelIndex(),
	// 	journelsLocal.all()
	// ]);
	// Object.entries(localJournels).map(([localId, localJournel]) => {
	// 	return [localId, localJournel];
	// });
}

if (typeof window === 'object') {
	userEmitter.on('signIn', syncJournels);

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
			syncJournels();
		}
	});
}
