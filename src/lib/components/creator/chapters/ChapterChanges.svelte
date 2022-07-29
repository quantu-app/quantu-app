<svelte:options immutable />

<script context="module" lang="ts">
	import { writable } from 'svelte/store';

	interface IState {
		chapterChangeNameFilter: string;
	}

	const state = writable<IState>({
		chapterChangeNameFilter: ''
	});
</script>

<script lang="ts">
	import ChapterChangeList from './ChapterChangeList.svelte';
	import CreateChapterChange from './CreateChapterChange.svelte';
	import { fuzzyEquals } from '@aicacia/string-fuzzy_equals';
	import Search from '$lib/components/Search.svelte';
	import type { StateChange } from '$lib/state/creator/changes';

	export let chapterChanges: StateChange[];

	function onChange(chapterChangeNameFilter: string) {
		state.update((state) => ({
			...state,
			chapterChangeNameFilter
		}));
	}
	$: chapterChangeNameFilter = $state.chapterChangeNameFilter;
	$: filter = (change: StateChange) =>
		chapterChangeNameFilter ? fuzzyEquals(chapterChangeNameFilter, change.name) : true;
	$: filteredChapterChanges = chapterChanges.filter((change) => change.latest).filter(filter);
</script>

<div class="container mb-8">
	<div class="d-flex justify-content-end mt-2">
		<CreateChapterChange />
	</div>
	<Search filter={chapterChangeNameFilter} {onChange} />
	<ChapterChangeList chapterChanges={filteredChapterChanges} />
</div>
