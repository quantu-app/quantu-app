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
	import type { StateCourse } from '$lib/state/creator/courses';
	import RichViewer from '$lib/components/editor/RichViewer.svelte';
	import UpdateCourse from './UpdateCourse.svelte';
	import type { StateDepartment } from '$lib/state/creator/departments';
	import type { StateChapter } from '$lib/state/chapters';

	export let department: StateDepartment;
	export let course: StateCourse;
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
	<h2>{course.name}</h2>
	<div>
		<RichViewer value={course.description} />
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
				href={`${base}/creator/departments/${department.id}courses/${course.id}/courses`}
				>Chapters <i class="bi bi-chevron-right" /></a
			>
			<CreateChapterChange {department} />
		</div>
	</div>
	<Search filter={nameFilter} {onChange} />
</div>

<div class="container">
	<ChapterList {department} chapters={filteredChapters} />
</div>

<UpdateCourse bind:open={createChangeOpen} {department} {course} />
