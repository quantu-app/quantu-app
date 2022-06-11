<svelte:options immutable />

<script context="module" lang="ts">
	import { writable } from 'svelte/store';

	interface IState {
		departmentChangeNameFilter: string;
	}

	const state = writable<IState>({
		departmentChangeNameFilter: ''
	});
</script>

<script lang="ts">
	import DepartmentChangeList from './DepartmentChangeList.svelte';
	import CreateDepartmentChange from './CreateDepartmentChange.svelte';
	import { fuzzyEquals } from '@aicacia/string-fuzzy_equals';
	import Search from '$lib/components/Search.svelte';
	import type { StateChange } from '$lib/state/creator/changes';

	export let departmentChanges: StateChange[];

	function onChange(departmentChangeNameFilter: string) {
		state.update((state) => ({
			...state,
			departmentChangeNameFilter
		}));
	}
	$: departmentChangeNameFilter = $state.departmentChangeNameFilter;
	$: filter = (department: StateChange) =>
		departmentChangeNameFilter
			? fuzzyEquals(departmentChangeNameFilter, (department.value as any)?.name)
			: true;
	$: filteredDepartmentChanges = departmentChanges
		.filter((changes) => changes.latest)
		.filter(filter);
</script>

<div class="container mb-8">
	<div class="d-flex justify-content-end mt-2">
		<CreateDepartmentChange />
	</div>
	<Search filter={departmentChangeNameFilter} {onChange} />
	<DepartmentChangeList departmentChanges={filteredDepartmentChanges} />
</div>
