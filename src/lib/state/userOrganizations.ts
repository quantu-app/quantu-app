import { Organization, OrganizationCreate, UserService } from '$lib/api/quantu-app-api';
import type { Readable } from 'svelte/store';
import { get, writable } from 'svelte/store';
import { load } from './loading';

interface IUserOrganizationsStore {
	byId: { [id: number]: Organization };
}

const userOrganizationsWritable = writable<IUserOrganizationsStore>({
	byId: {}
});

export const userOrganizations: Readable<IUserOrganizationsStore> = {
	subscribe: userOrganizationsWritable.subscribe
};

export async function getOrganization(id: number) {
	const cachedOrganization = get(userOrganizations).byId[id];
	if (cachedOrganization) {
		return cachedOrganization;
	}
	const organization = await load(UserService.quantuAppWebControllerUserOrganizationShow(id));
	userOrganizationsWritable.update((state) => addToState(state, organization));
	return organization;
}

export async function getOrganizations() {
	const cachedQuizzes = Object.values(get(userOrganizations).byId);
	if (cachedQuizzes.length) {
		return cachedQuizzes;
	}
	const organizations = await load(UserService.quantuAppWebControllerUserOrganizationIndex());
	userOrganizationsWritable.update((state) => organizations.reduce(addToState, state));
	return organizations;
}

export async function createOrganization(params: OrganizationCreate) {
	const organization = await load(UserService.quantuAppWebControllerUserOrganizationCreate(params));
	userOrganizationsWritable.update((state) => addToState(state, organization));
	return organization;
}

export async function updateOrganization(id: number, params: Partial<Organization>) {
	const organization = await load(
		UserService.quantuAppWebControllerUserOrganizationUpdate(id, params)
	);
	userOrganizationsWritable.update((state) => addToState(state, organization));
	return organization;
}

export async function deleteOrganization(id: number) {
	const organization = get(userOrganizationsWritable).byId[id];

	await load(UserService.quantuAppWebControllerUserOrganizationDelete(organization.id));
	userOrganizationsWritable.update((state) => deleteFromState(state, organization));
}

function addToState(
	state: IUserOrganizationsStore,
	organization: Organization
): IUserOrganizationsStore {
	state.byId[organization.id] = organization;
	return state;
}

function deleteFromState(
	state: IUserOrganizationsStore,
	organization: Organization
): IUserOrganizationsStore {
	delete state.byId[organization.id];
	return state;
}
