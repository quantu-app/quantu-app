<svelte:options immutable />

<script context="module" lang="ts">
	import { writable } from 'svelte/store';

	interface IState {
		departmentChangeNameFilter: string | undefined;
	}

	const state = writable<IState>({
		departmentChangeNameFilter: undefined
	});
</script>

<script lang="ts">
	import DepartmentChangeList from './DepartmentChangeList.svelte';
	import CreateDepartmentChange from './CreateDepartmentChange.svelte';
	import { fuzzyEquals } from '@aicacia/string-fuzzy_equals';
	import Search from '$lib/components/Search.svelte';
	import type { StateDepartment } from '$lib/state/creator/departments';
	import type { StateDepartmentChange } from '$lib/state/creator/departmentChanges';

	export let departmentChanges: StateDepartmentChange[];

	function onChange(departmentChangeNameFilter: string) {
		state.update((state) => ({
			...state,
			departmentChangeNameFilter
		}));
	}
	$: departmentChangeNameFilter = $state.departmentChangeNameFilter;
	$: filter = (department: StateDepartment) =>
		departmentChangeNameFilter ? fuzzyEquals(departmentChangeNameFilter, department.name) : true;
	$: filteredDepartmentChanges = departmentChanges.filter(filter);
</script>

<div class="container mb-8">
	<div class="d-flex justify-content-end mt-2">
		<CreateDepartmentChange />
	</div>
	<Search filter={departmentChangeNameFilter} {onChange} />
	<DepartmentChangeList departmentChanges={filteredDepartmentChanges} />
</div>
