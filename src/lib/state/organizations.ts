import { Organization, OrganizationService } from '$lib/api/quantu-app-api';
import type { Readable } from 'svelte/store';
import { get, writable } from 'svelte/store';
import { isOnline } from './online';
import { LocalJSON } from './LocalJSON';
import { getCurrentUser, isSignedIn, userEmitter } from './user';
import { isEmptyObject } from '$lib/utils';
import EventEmitter from 'eventemitter3';

const organizationsLocal = new LocalJSON<Organization>('organizations'),
	organizationsWritable = writable<Record<string, Organization>>({});

export const organizationEmitter = new EventEmitter<{ sync: () => void }>();

export const organizations: Readable<Record<string, Organization>> = {
	subscribe: organizationsWritable.subscribe
};

export async function createOrganization(name: string) {
	const organization: Organization = {
		...emptyOrganization(),
		name,
		userId: isSignedIn() ? getCurrentUser().id : null
	};

	if (isOnline() && isSignedIn()) {
		Object.assign(
			organization,
			await OrganizationService.quantuAppWebControllerOrganizationCreate(organization)
		);
	}

	const localId = await organizationsLocal.createTableId();
	organizationsWritable.update((state) => {
		state[localId] = organization;
		return state;
	});
	await organizationsLocal.set(localId, organization);
	return [localId, organization];
}

export async function updateOrganization(localId: string, updates: Partial<Organization>) {
	const oldOrganization = get(organizationsWritable)[localId] || emptyOrganization(),
		organization = { ...oldOrganization, ...updates, updatedAt: new Date().toJSON() };

	if (oldOrganization.id && isOnline() && isSignedIn()) {
		Object.assign(
			organization,
			await OrganizationService.quantuAppWebControllerOrganizationUpdate(
				oldOrganization.id,
				updates
			)
		);
	}

	organizationsWritable.update((state) => {
		state[localId] = organization;
		return state;
	});
	await organizationsLocal.set(localId, organization);
	return organization;
}

export async function deleteOrganization(localId: string) {
	const organization = get(organizationsWritable)[localId];

	if (organization?.id && isOnline() && isSignedIn()) {
		await OrganizationService.quantuAppWebControllerOrganizationDelete(organization.id);
	}
	organizationsWritable.update((state) => {
		delete state[localId];
		return state;
	});
	await organizationsLocal.remove(localId);
}

function emptyOrganization(): Organization {
	return {
		id: null,
		name: null,
		url: null,
		userId: null,
		insertedAt: new Date().toJSON(),
		updatedAt: new Date().toJSON()
	};
}

let syncing = false;
async function syncOrganizations(localOrganizationsByLocalId: Record<string, Organization>) {
	if (syncing) {
		return;
	}
	syncing = true;
	try {
		const serverOrganizations = await OrganizationService.quantuAppWebControllerOrganizationIndex(),
			serverOrganizationsById = serverOrganizations.reduce<Record<string, Organization>>(
				(byId, organization) => {
					byId[organization.id] = organization;
					return byId;
				},
				{}
			),
			localOrganizationsById: Record<string, [string, Organization]> = {},
			localOrganizationsToCreate: [string, Organization][] = [],
			localOrganizationsToDelete: [string, Organization][] = [],
			promises: Promise<[localId: string, organization: Organization, remove?: boolean]>[] = [];

		Object.entries(localOrganizationsByLocalId).forEach(([localId, localOrganization]) => {
			if (localOrganization.id && localOrganization.userId) {
				if (serverOrganizationsById[localOrganization.id]) {
					localOrganizationsById[localOrganization.id] = [localId, localOrganization];
				} else {
					localOrganizationsToDelete.push([localId, localOrganization]);
				}
			} else {
				localOrganizationsToCreate.push([localId, localOrganization]);
			}
		});

		serverOrganizations.forEach((serverOrganization) => {
			const localEntry = localOrganizationsById[serverOrganization.id];

			if (localEntry) {
				const [localId, localOrganization] = localEntry;

				if (serverOrganization.updatedAt !== localOrganization.updatedAt) {
					const serverUpdatedAt = new Date(serverOrganization.updatedAt),
						localUpdatedAt = new Date(localOrganization.updatedAt);

					if (serverUpdatedAt > localUpdatedAt) {
						promises.push(
							organizationsLocal
								.set(localId, serverOrganization)
								.then(() => [localId, serverOrganization])
						);
					} else {
						const requestBody = organizationChanges(serverOrganization, localOrganization);

						if (!isEmptyObject(requestBody)) {
							promises.push(
								OrganizationService.quantuAppWebControllerOrganizationUpdate(
									serverOrganization.id,
									requestBody
								).then((updatedOrganization) =>
									organizationsLocal
										.set(localId, updatedOrganization)
										.then(() => [localId, updatedOrganization])
								)
							);
						}
					}
				} else {
					promises.push(
						organizationsLocal
							.set(localId, serverOrganization)
							.then(() => [localId, serverOrganization])
					);
				}
			} else {
				promises.push(
					organizationsLocal
						.createTableId()
						.then((localId) =>
							organizationsLocal
								.set(localId, serverOrganization)
								.then(() => [localId, serverOrganization])
						)
				);
			}
		});

		localOrganizationsToCreate.forEach(([localId, localOrganization]) => {
			promises.push(
				OrganizationService.quantuAppWebControllerOrganizationCreate(localOrganization).then(
					(organization) =>
						organizationsLocal.set(localId, organization).then(() => [localId, organization])
				)
			);
		});
		localOrganizationsToDelete.forEach(([localId, organization]) => {
			promises.push(organizationsLocal.remove(localId).then(() => [localId, organization, true]));
		});

		const organizationUpdates = await Promise.all(promises);

		organizationsWritable.update((state) =>
			organizationUpdates.reduce((state, [localId, organization, remove]) => {
				if (remove) {
					delete state[localId];
				} else {
					state[localId] = organization;
				}
				return state;
			}, state)
		);
	} finally {
		syncing = false;
		organizationEmitter.emit('sync');
	}
}

function organizationChanges(prev: Organization, next: Organization) {
	const updates: Partial<Organization> = {};
	if (prev.name !== next.name) {
		updates.name = next.name;
	}
	if (prev.url !== next.url) {
		updates.url = next.url;
	}
	return updates;
}

if (typeof window === 'object') {
	userEmitter.on('signIn', (user) =>
		organizationsLocal
			.all((organization) => organization.userId === user.id || !organization.userId)
			.then((localOrganizations) => syncOrganizations(localOrganizations))
	);
	userEmitter.on('signOut', () =>
		organizationsLocal
			.all((organization) => !organization.userId)
			.then((localOrganizations) =>
				organizationsWritable.update(() =>
					Object.entries(localOrganizations).reduce((state, [localId, organization]) => {
						state[localId] = organization;
						return state;
					}, {})
				)
			)
	);

	organizationsLocal.all().then((organizations) => {
		const user = getCurrentUser();

		Object.entries(organizations).forEach(([localId, organization]) => {
			if (user ? organization.userId !== user.id : organization.userId) {
				delete organizations[localId];
			}
		});

		organizationsWritable.update(() =>
			Object.entries(organizations).reduce((state, [localId, organization]) => {
				state[localId] = organization;
				return state;
			}, {})
		);

		if (user) {
			syncOrganizations(organizations);
		}
	});
}
