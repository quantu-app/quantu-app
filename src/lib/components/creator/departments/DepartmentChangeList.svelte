<svelte:options immutable />

<script lang="ts">
	import DepartmentChangeListItem from './DepartmentChangeListItem.svelte';
	import type { StateChange } from '$lib/state/creator/changes';

	export let departmentChanges: StateChange[];
</script>

<div class="container p-0">
	<div class="row">
		{#each departmentChanges as departmentChange (departmentChange.id)}
			<DepartmentChangeListItem {departmentChange} />
		{/each}
	</div>
</div>
