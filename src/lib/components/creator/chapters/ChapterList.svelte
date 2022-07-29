<svelte:options immutable />

<script lang="ts">
	import ChapterListItem from './ChapterListItem.svelte';
	import type { StateChapter } from '$lib/state/creator/chapters';
	import type { StateDepartment } from '$lib/state/creator/departments';

	export let department: StateDepartment;
	export let chapters: StateChapter[];
</script>

<div class="container p-0">
	<div class="row">
		{#each chapters as chapter (chapter.id)}
			<ChapterListItem {department} {chapter} />
		{/each}
	</div>
</div>
