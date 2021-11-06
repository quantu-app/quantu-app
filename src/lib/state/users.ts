import { browser } from '$app/env';
import { UserService } from '$lib/api/quantu-app-api';
import type { UserPublic } from '$lib/api/quantu-app-api/models/UserPublic';
import type { Readable } from 'svelte/store';
import { get, writable } from 'svelte/store';
import { load } from './loading';
import { userEmitter } from './user';

interface IUsersStore {
	byId: { [id: number]: UserPublic };
}

const usersWritable = writable<IUsersStore>({
	byId: {}
});

export const users: Readable<IUsersStore> = {
	subscribe: usersWritable.subscribe
};

export async function getUser(id: string) {
	const cachedUser = get(users).byId[id];
	if (cachedUser) {
		return cachedUser;
	}
	const user = await load(UserService.quantuAppWebControllerUserShow(id));
	usersWritable.update((state) => addToState(state, user));
	return user;
}

function addToState(state: IUsersStore, user: UserPublic): IUsersStore {
	state.byId[user.id] = user;
	return state;
}

if (browser) {
	userEmitter.on('signOut', () =>
		usersWritable.set({
			byId: {}
		})
	);
}
