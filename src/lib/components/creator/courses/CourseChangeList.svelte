<svelte:options immutable />

<script lang="ts">
	import CourseChangeListItem from './CourseChangeListItem.svelte';
	import type { StateChange } from '$lib/state/creator/changes';

	export let courseChanges: StateChange[];
</script>

<div class="container p-0">
	<div class="row">
		{#each courseChanges as courseChange (courseChange.id)}
			<CourseChangeListItem {courseChange} />
		{/each}
	</div>
</div>
