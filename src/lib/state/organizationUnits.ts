import { browser } from '$app/env';
import type { Unit, UnitChildList, UnitCreate, UnitUpdate } from '$lib/api/quantu-app-api';
import { UserService } from '$lib/api/quantu-app-api';
import type { Readable } from 'svelte/store';
import { get, writable } from 'svelte/store';
import { load } from './loading';
import { userEmitter } from './user';

interface IOrganizationUnitsStore {
	byId: { [id: number]: Unit };
	byOrganizationId: {
		[organizationId: number]: { [id: number]: Unit };
	};
	byCourseId: {
		[organizationId: number]: { [id: number]: Unit };
	};
	childrenById: { [id: number]: UnitChildList };
}

const organizationUnitsWritable = writable<IOrganizationUnitsStore>({
	byId: {},
	byOrganizationId: {},
	byCourseId: {},
	childrenById: {}
});

export const organizationUnits: Readable<IOrganizationUnitsStore> = {
	subscribe: organizationUnitsWritable.subscribe
};

export async function getUnit(organizationId: number, id: number) {
	const cachedUnit = get(organizationUnits).byId[id];
	if (cachedUnit) {
		return cachedUnit;
	}
	const unit = await load(UserService.quantuAppWebControllerUserUnitShow(id, organizationId));
	organizationUnitsWritable.update((state) => addToState(state, unit));
	return unit;
}

export async function getUnitChildren(organizationId: number, id: number) {
	const children = await load(
		UserService.quantuAppWebControllerUserUnitChildren(id, organizationId)
	);
	organizationUnitsWritable.update((state) => {
		state.childrenById[id] = children;
		return state;
	});
	return children;
}

export async function getUnits(organizationId: number, courseId?: number, force = false) {
	if (!force) {
		if (courseId) {
			const cachedUnits = Object.values(get(organizationUnits).byCourseId[courseId] || {});
			if (cachedUnits.length) {
				return cachedUnits.filter((unit) => unit.organizationId === organizationId);
			}
		}
		if (organizationId) {
			const cachedUnits = Object.values(
				get(organizationUnits).byOrganizationId[organizationId] || {}
			);
			if (cachedUnits.length) {
				return cachedUnits;
			}
		}
	}
	const units = await load(
		UserService.quantuAppWebControllerUserUnitIndex(organizationId, courseId)
	);
	organizationUnitsWritable.update((state) => {
		state.byOrganizationId[organizationId] = {};
		if (courseId) {
			state.byCourseId[courseId] = {};
		}
		return units.reduce(addToState, state);
	});
	return units;
}

export async function createUnit(organizationId: number, params: UnitCreate) {
	const unit = await load(UserService.quantuAppWebControllerUserUnitCreate(organizationId, params));
	organizationUnitsWritable.update((state) => addToState(state, unit));
	return unit;
}

export async function updateUnit(organizationId: number, id: number, params: UnitUpdate) {
	const unit = await load(
		UserService.quantuAppWebControllerUserUnitUpdate(id, organizationId, params)
	);
	organizationUnitsWritable.update((state) => addToState(state, unit));
	return unit;
}

export async function deleteUnit(organizationId: number, id: number) {
	const unit = get(organizationUnitsWritable).byId[id];

	await load(UserService.quantuAppWebControllerUserUnitDelete(unit.id, organizationId));
	organizationUnitsWritable.update((state) => deleteFromState(state, unit));
}

function addToState(state: IOrganizationUnitsStore, unit: Unit): IOrganizationUnitsStore {
	const byOrganizationId =
		state.byOrganizationId[unit.organizationId] ||
		(state.byOrganizationId[unit.organizationId] = {});

	if (unit.courseId) {
		const byCourseId = state.byCourseId[unit.courseId] || (state.byCourseId[unit.courseId] = {});
		byCourseId[unit.id] = unit;
		unit = { ...unit, courseId: null, index: null };
	}
	byOrganizationId[unit.id] = unit;
	state.byId[unit.id] = unit;
	return state;
}

function deleteFromState(state: IOrganizationUnitsStore, unit: Unit): IOrganizationUnitsStore {
	const byOrganizationId =
		state.byOrganizationId[unit.organizationId] ||
		(state.byOrganizationId[unit.organizationId] = {});
	for (const units of Object.values(state.byCourseId || {})) {
		if (unit.id in units) {
			delete units[unit.id];
		}
	}
	delete byOrganizationId[unit.id];
	delete state.byId[unit.id];
	return state;
}

if (browser) {
	userEmitter.on('signOut', () =>
		organizationUnitsWritable.set({
			byId: {},
			byCourseId: {},
			byOrganizationId: {},
			childrenById: {}
		})
	);
}
