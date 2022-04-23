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
	import CreateDepartment from './CreateDepartment.svelte';
	import { fuzzyEquals } from '@aicacia/string-fuzzy_equals';
	import Search from '$lib/components/Search.svelte';
	import type { Department } from '@prisma/client';

	export let departments: Department[];

	$: filter = (department: Department) =>
		$state.departmentNameFilter ? fuzzyEquals($state.departmentNameFilter, department.name) : true;
</script>

<div class="container">
	<div class="d-flex justify-content-end mt-2">
		<CreateDepartment />
	</div>
	<Search bind:filter={$state.departmentNameFilter} />
</div>

<div class="container">
	<DepartmentList departments={departments.filter(filter)} />
</div>
