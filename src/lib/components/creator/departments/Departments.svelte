<svelte:options immutable />

<script context="module" lang="ts">
	import { writable } from 'svelte/store';

	interface IState {
		departmentNameFilter: string | undefined;
	}

	const state = writable<IState>({
		departmentNameFilter: undefined
	});
</script>

<script lang="ts">
	import DepartmentList from './DepartmentList.svelte';
	import CreateDepartmentDraft from './CreateDepartmentDraft.svelte';
	import { fuzzyEquals } from '@aicacia/string-fuzzy_equals';
	import Search from '$lib/components/Search.svelte';
	import type { StateDepartment } from '$lib/state/creator/departments';
	import { base } from '$app/paths';

	export let departments: StateDepartment[];

	function onChange(departmentNameFilter: string) {
		state.update((state) => ({
			...state,
			departmentNameFilter
		}));
	}
	$: departmentNameFilter = $state.departmentNameFilter;
	$: filter = (department: StateDepartment) =>
		departmentNameFilter ? fuzzyEquals(departmentNameFilter, department.name) : true;
	$: filteredDepartments = departments.filter(filter);
</script>

<div class="container mb-8">
	<div class="d-flex align-items-center justify-content-end mt-2">
		<a class="link-dark me-2" href={`${base}/creator/departments/drafts`}
			>Drafts <i class="bi bi-chevron-right" /></a
		>
		<CreateDepartmentDraft />
	</div>
	<Search filter={departmentNameFilter} {onChange} />
	<DepartmentList departments={filteredDepartments} />
</div>
