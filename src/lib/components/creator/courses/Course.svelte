<svelte:options immutable />

<script context="module" lang="ts">
	import { derived, writable } from 'svelte/store';

	interface IState {
		search: string | undefined;
		selectedId: string;
		selectedType: 'course' | 'chapter' | 'lesson';
	}

	const state = writable<IState>({
		search: undefined,
		selectedId: '' as any,
		selectedType: 'course'
	});

	export const selected = derived(
		[state, coursesById, chaptersById, lessonsById],
		([state, coursesById, chaptersById, lessonsById]) => {
			switch (state.selectedType) {
				case 'course':
					return coursesById[state.selectedId];
				case 'chapter':
					return chaptersById[state.selectedId];
				case 'lesson':
					return lessonsById[state.selectedId];
				default:
					return undefined;
			}
		}
	);

	export function setSelected(selectedType: IState['selectedType'], selectedId: string) {
		state.update((state) => ({
			...state,
			selectedId,
			selectedType
		}));
	}
</script>

<script lang="ts">
	import { fuzzyEquals } from '@aicacia/string-fuzzy_equals';
	import { coursesById, type StateCourse } from '$lib/state/creator/courses';
	import type { StateDepartment } from '$lib/state/creator/departments';
	import { chaptersById, type StateChapter } from '$lib/state/creator/chapters';
	import ChapterTreeItem from './ChapterTreeItem.svelte';
	import Search from '$lib/components/Search.svelte';
	import CreateChapter from './CreateChapter.svelte';
	import ContextMenu from '$lib/components/ui/ContextMenu.svelte';
	import Editor from './Editor.svelte';
	import { lessonsById } from '$lib/state/creator/lessons';

	export let department: StateDepartment;
	export let course: StateCourse;
	export let chapters: StateChapter[];

	let courseElement: HTMLElement;

	function onSelectCourse() {
		setSelected('course', course.id);
	}
	onSelectCourse();

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
				bind:this={courseElement}
				class="list-group-item list-group-item-action"
				class:active={$selected === course}
				on:click={onSelectCourse}
			>
				<p class="align-self-center m-0 p-0">{course.name}</p>
			</li>
			{#each filteredChapters as chapter (chapter.id)}
				<ChapterTreeItem {search} {department} {course} {chapter} />
			{/each}
		</ul>
	</div>
	<div class="d-flex flex-column flex-grow-1 px-2">
		<Search filter={search} {onChange} />
		<div class="mt-2 mb-8">
			<Editor />
		</div>
	</div>
</div>

<ContextMenu target={courseElement}>
	<li><button class="dropdown-item" on:click={onCreatingChapter}>Add Chapter</button></li>
</ContextMenu>

<CreateChapter {department} {course} bind:open={openCreateChapter} />

<style>
	.course-sidebar {
		min-width: 256px;
	}
</style>
