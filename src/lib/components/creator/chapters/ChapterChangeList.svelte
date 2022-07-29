<svelte:options immutable />

<script lang="ts">
	import ChapterChangeListItem from './ChapterChangeListItem.svelte';
	import type { StateChange } from '$lib/state/creator/changes';

	export let chapterChanges: StateChange[];
</script>

<div class="container p-0">
	<div class="row">
		{#each chapterChanges as chapterChange (chapterChange.id)}
			<ChapterChangeListItem {chapterChange} />
		{/each}
	</div>
</div>
