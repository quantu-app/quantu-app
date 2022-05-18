<svelte:options immutable />

<script lang="ts">
	import DepartmentListItem from './DepartmentListItem.svelte';
	import type { StateDepartment } from '$lib/state/creator/departments';

	export let departments: StateDepartment[];
</script>

<div class="container p-0">
	<div class="row">
		{#each departments as department (department.id)}
			<DepartmentListItem {department} />
		{/each}
	</div>
</div>
