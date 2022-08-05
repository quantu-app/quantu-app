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
	import type { StateLesson } from '$lib/state/creator/lessons';
	import type { StateLessonBlock } from '$lib/state/creator/lessonBlocks';

	export let department: StateDepartment;
	export let course: StateCourse;
	export let chapters: StateChapter[];

	let selected: StateCourse | StateChapter | StateLesson | StateLessonBlock = course;
	function onSelect(newSelected: any) {
		if (newSelected !== selected) {
			selected = newSelected;
		} else {
			selected = course;
		}
	}
	function onSelectCourse() {
		selected = course;
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
	<div class="course-sidebar d-flex flex-column flex-shrink overflow-auto border-end">
		<ul class="list-group list-group-flush">
			<li
				class="list-group-item list-group-item-action"
				class:active={selected === course}
				on:click={onSelectCourse}
			>
				<div class="d-flex flex-grow-1 justify-content-between">
					<p class="align-self-center m-0 p-0">{course.name}</p>
					<button class="btn btn-sm btn-secondary" on:click={onCreatingChapter}
						><i class="bi bi-plus" /></button
					>
				</div>
			</li>
			{#each filteredChapters as chapter (chapter.id)}
				<ChapterTreeItem {search} {department} {course} {chapter} {selected} {onSelect} />
			{/each}
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

<style>
	.course-sidebar {
		min-width: 256px;
	}
</style>
