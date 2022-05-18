<svelte:options immutable />

<script lang="ts">
	import DepartmentDraftListItem from './DepartmentDraftListItem.svelte';
	import type { StateDepartmentDraft } from '$lib/state/creator/departmentDrafts';

	export let departmentDrafts: StateDepartmentDraft[];
</script>

<div class="container p-0">
	<div class="row">
		{#each departmentDrafts as departmentDraft (departmentDraft.id)}
			<DepartmentDraftListItem {departmentDraft} />
		{/each}
	</div>
</div>
