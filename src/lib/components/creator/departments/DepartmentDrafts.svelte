<svelte:options immutable />

<script context="module" lang="ts">
	import { writable } from 'svelte/store';

	interface IState {
		departmentDraftNameFilter: string | undefined;
	}

	const state = writable<IState>({
		departmentDraftNameFilter: undefined
	});
</script>

<script lang="ts">
	import DepartmentDraftList from './DepartmentDraftList.svelte';
	import CreateDepartmentDraft from './CreateDepartmentDraft.svelte';
	import { fuzzyEquals } from '@aicacia/string-fuzzy_equals';
	import Search from '$lib/components/Search.svelte';
	import type { StateDepartment } from '$lib/state/creator/departments';
	import type { StateDepartmentDraft } from '$lib/state/creator/departmentDrafts';

	export let departmentDrafts: StateDepartmentDraft[];

	function onChange(departmentDraftNameFilter: string) {
		state.update((state) => ({
			...state,
			departmentDraftNameFilter
		}));
	}
	$: departmentDraftNameFilter = $state.departmentDraftNameFilter;
	$: filter = (department: StateDepartment) =>
		departmentDraftNameFilter ? fuzzyEquals(departmentDraftNameFilter, department.name) : true;
	$: filteredDepartmentDrafts = departmentDrafts.filter(filter);
</script>

<div class="container mb-8">
	<div class="d-flex justify-content-end mt-2">
		<CreateDepartmentDraft />
	</div>
	<Search filter={departmentDraftNameFilter} {onChange} />
	<DepartmentDraftList departmentDrafts={filteredDepartmentDrafts} />
</div>
