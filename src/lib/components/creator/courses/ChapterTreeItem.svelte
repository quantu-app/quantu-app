<svelte:options immutable />

<script lang="ts">
	import type { StateChapter } from '$lib/state/creator/chapters';
	import { lessonsByChapterId, showLessons, type StateLesson } from '$lib/state/creator/lessons';
	import { fuzzyEquals } from '@aicacia/string-fuzzy_equals';

	export let chapter: StateChapter;
	export let selected: StateChapter | undefined;
	export let search = '';
	export let onSelect: (newSelected: any) => void;

	function onSelectInternal() {
		onSelect(chapter);
	}
	let expanded = false;
	function onToggleExpand(e: MouseEvent) {
		e.stopPropagation();
		expanded = !expanded;
	}

	let loaded = false;
	let loading = false;
	$: if (expanded === true && !loading && !loaded) {
		loading = true;
		showLessons(chapter.id)
			.then(() => {
				loaded = true;
			})
			.finally(() => {
				loading = false;
			});
	}
	$: lessons = $lessonsByChapterId[chapter.id] || [];
	$: filterLessons = (chapter: StateLesson) => (search ? fuzzyEquals(search, chapter.name) : true);
	$: filteredLessons = lessons.filter(filterLessons);
</script>

<li
	class="list-group-item list-group-item-action"
	class:active={selected === chapter}
	on:click={onSelectInternal}
>
	<div class="d-flex flex-row">
		<button class="btn btn-sm btn-ghost" on:click={onToggleExpand}
			>{#if expanded}<i class="bi bi-caret-down-fill" />{:else}<i
					class="bi bi-caret-right-fill"
				/>{/if}</button
		>
		<h5 class="align-self-center m-0 p-0">{chapter.name}</h5>
	</div>
	<ul>
		{#each filteredLessons as lesson (lesson.id)}
			{lesson.name}
		{/each}
	</ul>
</li>
