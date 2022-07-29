<svelte:options immutable />

<script context="module" lang="ts">
	import { writable } from 'svelte/store';

	interface IState {
		chapterNameFilter: string | undefined;
	}

	const state = writable<IState>({
		chapterNameFilter: undefined
	});
</script>

<script lang="ts">
	import ChapterList from './ChapterList.svelte';
	import CreateChapterChange from './CreateChapterChange.svelte';
	import { fuzzyEquals } from '@aicacia/string-fuzzy_equals';
	import Search from '$lib/components/Search.svelte';
	import type { StateChapter } from '$lib/state/creator/chapters';
	import { base } from '$app/paths';
	import type { StateDepartment } from '$lib/state/creator/departments';

	export let department: StateDepartment;
	export let chapters: StateChapter[];

	function onChange(chapterNameFilter: string) {
		state.update((state) => ({
			...state,
			chapterNameFilter
		}));
	}
	$: chapterNameFilter = $state.chapterNameFilter;
	$: filter = (chapter: StateChapter) =>
		chapterNameFilter ? fuzzyEquals(chapterNameFilter, chapter.name) : true;
	$: filteredChapters = chapters.filter(filter);
</script>

<div class="container mb-8">
	<div class="d-flex align-items-center justify-content-end mt-2">
		<a class="link-dark me-2" href={`${base}/creator/merge-requests`}>Merge Requests</a>
		<a class="link-dark me-2" href={`${base}/creator/chapters/changes`}>Changes</a>
		<CreateChapterChange {department} />
	</div>
	<Search filter={chapterNameFilter} {onChange} />
	<ChapterList {department} chapters={filteredChapters} />
</div>
