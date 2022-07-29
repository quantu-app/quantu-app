<svelte:options immutable />

<script context="module" lang="ts">
	import { writable } from 'svelte/store';

	interface IState {
		nameFilter: string | undefined;
	}

	const state = writable<IState>({
		nameFilter: undefined
	});
</script>

<script lang="ts">
	import { fuzzyEquals } from '@aicacia/string-fuzzy_equals';
	import Search from '$lib/components/Search.svelte';
	import ChapterList from '$lib/components/creator/chapters/ChapterList.svelte';
	import CreateChapterChange from '../chapters/CreateChapterChange.svelte';
	import { base } from '$app/paths';
	import type { StateChapter } from '$lib/state/creator/chapters';
	import RichViewer from '$lib/components/editor/RichViewer.svelte';
	import UpdateChapter from './UpdateChapter.svelte';
	import type { StateDepartment } from '$lib/state/creator/departments';
	import type { StateCourse } from '$lib/state/courses';

	export let department: StateDepartment;
	export let course: StateCourse;
	export let chapter: StateChapter;
	export let chapters: StateChapter[];

	let createChangeOpen = false;
	function onOpenCreateChange() {
		createChangeOpen = true;
	}

	function onChange(nameFilter: string) {
		state.update((state) => ({ ...state, nameFilter }));
	}
	$: nameFilter = $state.nameFilter || '';
	$: filterChapters = (chapter: StateChapter) =>
		nameFilter ? fuzzyEquals(nameFilter, chapter.name) : true;
	$: filteredChapters = chapters.filter(filterChapters);
</script>

<div class="container">
	<h2>{chapter.name}</h2>
	<div>
		<RichViewer value={chapter.description} />
	</div>
</div>
<div class="container">
	<div class="d-flex justify-content-between mt-2">
		<div class="d-flex">
			<button class="btn btn-primary" on:click={onOpenCreateChange}>Propose a Change</button>
		</div>
		<div class="d-flex align-items-center">
			<a
				class="link-dark me-2"
				href={`${base}/creator/departments/${department.id}/chapters/${chapter.id}/assets`}
				>Assets <i class="bi bi-chevron-right" /></a
			>
			<a
				class="link-dark me-2"
				href={`${base}/creator/departments/${department.id}chapters/${chapter.id}/chapters`}
				>Chapters <i class="bi bi-chevron-right" /></a
			>
			<CreateChapterChange {department} chapterId={chapter.id} />
		</div>
	</div>
	<Search filter={nameFilter} {onChange} />
</div>

<div class="container">
	<ChapterList {department} chapters={filteredChapters} />
</div>

<UpdateChapter bind:open={createChangeOpen} {chapter} />
