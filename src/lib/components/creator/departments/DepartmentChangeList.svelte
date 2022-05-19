<svelte:options immutable />

<script lang="ts">
	import DepartmentChangeListItem from './DepartmentChangeListItem.svelte';
	import type { StateDepartmentChange } from '$lib/state/creator/departmentChanges';

	export let departmentChanges: StateDepartmentChange[];
</script>

<div class="container p-0">
	<div class="row">
		{#each departmentChanges as departmentChange (departmentChange.id)}
			<DepartmentChangeListItem {departmentChange} />
		{/each}
	</div>
</div>
