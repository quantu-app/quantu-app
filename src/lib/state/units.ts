import { browser } from '$app/env';
import type { Unit, UnitChildList } from '$lib/api/quantu-app-api';
import { UnitService } from '$lib/api/quantu-app-api';
import type { Readable } from 'svelte/store';
import { get, writable } from 'svelte/store';
import { load } from './loading';
import { userEmitter } from './user';

interface IUnitsStore {
	byId: { [id: number]: Unit };
	byCourseId: { [courseId: number]: { [id: number]: Unit } };
	byOrganizationId: { [organizationId: number]: { [id: number]: Unit } };
	childrenById: { [id: number]: UnitChildList };
}

const unitsWritable = writable<IUnitsStore>({
	byId: {},
	byCourseId: {},
	byOrganizationId: {},
	childrenById: {}
});

export const units: Readable<IUnitsStore> = {
	subscribe: unitsWritable.subscribe
};

export async function getUnit(id: number) {
	const cachedUnit = get(units).byId[id];
	if (cachedUnit) {
		return cachedUnit;
	}
	const unit = await load(UnitService.quantuAppWebControllerUnitShow(id));
	unitsWritable.update((state) => addToState(state, unit));
	return unit;
}

export async function getUnitChildren(id: number) {
	const children = await load(UnitService.quantuAppWebControllerUnitChildren(id));
	unitsWritable.update((state) => {
		state.childrenById[id] = children;
		return state;
	});
	return children;
}

export async function getUnits(organizationId?: number, courseId?: number, force = false) {
	if (!force) {
		if (courseId) {
			const cachedUnits = Object.values(get(unitsWritable).byCourseId[courseId] || {});
			if (cachedUnits.length) {
				if (organizationId) {
					return cachedUnits.filter((unit) => unit.organizationId === organizationId);
				} else {
					return cachedUnits;
				}
			}
		} else if (organizationId) {
			const cachedUnits = Object.values(get(unitsWritable).byOrganizationId[organizationId] || {});
			if (cachedUnits.length) {
				return cachedUnits;
			}
		} else {
			const cachedUnits = Object.values(get(unitsWritable).byId || {});
			if (cachedUnits.length) {
				return cachedUnits;
			}
		}
	}
	const units = await load(UnitService.quantuAppWebControllerUnitIndex(organizationId, courseId));
	unitsWritable.update((state) => {
		state.byOrganizationId[organizationId] = {};
		if (courseId) {
			state.byCourseId[courseId] = {};
		}
		return units.reduce(addToState, state);
	});
	return units;
}

export async function addUnitsToCourse(
	organizationId: number,
	courseId: number,
	unitIds: number[]
) {
	unitsWritable.update((state) => {
		const byOrganizationId =
				state.byOrganizationId[organizationId] || (state.byOrganizationId[organizationId] = {}),
			byCourseId = state.byCourseId[courseId] || (state.byCourseId[courseId] = {});

		for (const unitId of unitIds) {
			const unit = byOrganizationId[unitId];
			byCourseId[unitId] = { ...unit, courseId: courseId };
		}

		return state;
	});
}

export async function removeUnitsFromCourse(courseId: number, unitIds: number[]) {
	unitsWritable.update((state) => {
		const byCourseId = state.byCourseId[courseId] || (state.byCourseId[courseId] = {});

		for (const unitId of unitIds) {
			delete byCourseId[unitId];
		}

		return state;
	});
}

function addToState(state: IUnitsStore, unit: Unit): IUnitsStore {
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

if (browser) {
	userEmitter.on('signOut', () =>
		unitsWritable.set({
			byId: {},
			byCourseId: {},
			byOrganizationId: {},
			childrenById: {}
		})
	);
}
