<svelte:options immutable />

<script context="module" lang="ts">
	import { writable } from 'svelte/store';

	interface IState {
		search: string | undefined;
	}

	const state = writable<IState>({
		search: undefined
	});
</script>

<script lang="ts">
	import { fuzzyEquals } from '@aicacia/string-fuzzy_equals';
	import type { StateCourse } from '$lib/state/creator/courses';
	import type { StateDepartment } from '$lib/state/creator/departments';
	import type { StateChapter } from '$lib/state/creator/chapters';
	import ChapterTreeItem from './ChapterTreeItem.svelte';
	import Search from '$lib/components/Search.svelte';
	import CreateChapter from './CreateChapter.svelte';

	export let department: StateDepartment;
	export let course: StateCourse;
	export let chapters: StateChapter[];

	let selected: StateChapter | undefined;
	function onSelect(newSelected: any) {
		if (newSelected !== selected) {
			selected = newSelected;
		} else {
			selected = undefined;
		}
	}

	let openCreateChapter = false;
	function onCreatingChapter() {
		openCreateChapter = true;
	}

	function onChange(search: string) {
		state.update((state) => ({ ...state, search }));
	}
	$: search = $state.search || '';
	$: filterChapters = (chapter: StateChapter) =>
		search ? fuzzyEquals(search, chapter.name) : true;
	$: filteredChapters = chapters.filter(filterChapters);
</script>

<div class="d-flex flex-grow-1 flex-row w-100 h-100 pe-2 border-top">
	<div class="d-flex flex-column flex-shrink overflow-auto border-end">
		<ul class="list-group list-group-flush">
			{#each filteredChapters as chapter (chapter.id)}
				<ChapterTreeItem {search} {chapter} {selected} {onSelect} />
			{/each}
			<li class="list-group-item">
				<button class="btn btn-primary" on:click={onCreatingChapter}>Create Chapter</button>
			</li>
		</ul>
	</div>
	<div class="d-flex flex-column flex-grow-1 px-2">
		<Search filter={search} {onChange} />
		<div>
			<pre>{JSON.stringify(selected, null, 2)}<pre /></pre>
		</div>
	</div>
</div>

<CreateChapter {department} {course} bind:open={openCreateChapter} />
