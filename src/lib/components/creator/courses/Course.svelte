<svelte:options immutable />

<script context="module" lang="ts">
	import { derived, writable } from 'svelte/store';

	interface IState {
		search: string | undefined;
		selectedId: string;
		selectedType: 'course' | 'chapter' | 'lesson' | 'lesson-block';
	}

	const state = writable<IState>({
		search: undefined,
		selectedId: '' as any,
		selectedType: 'course'
	});

	export const selected = derived(
		[state, coursesById, chaptersById, lessonsById, lessonBlocksById],
		([state, coursesById, chaptersById, lessonsById, lessonBlocksById]) => {
			switch (state.selectedType) {
				case 'course':
					return coursesById[state.selectedId];
				case 'chapter':
					return chaptersById[state.selectedId];
				case 'lesson':
					return lessonsById[state.selectedId];
				case 'lesson-block': // TODO: rename all lesson-blocks to learning blocks
					return lessonBlocksById[state.selectedId];
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
	import { chaptersById, sortChapters, type StateChapter } from '$lib/state/creator/chapters';
	import ChapterTreeItem from './ChapterTreeItem.svelte';
	import Search from '$lib/components/Search.svelte';
	import CreateChapter from './CreateChapter.svelte';
	import ContextMenu from '$lib/components/ui/ContextMenu.svelte';
	import Editor from './Editor.svelte';
	import { lessonsById } from '$lib/state/creator/lessons';
	import SortableList from '$lib/components/ui/SortableList.svelte';
	import { addNotification, NotificationType } from '$lib/state/notifications';
	import { lessonBlocksById } from '$lib/state/creator/lessonBlocks';

	export let department: StateDepartment;
	export let course: StateCourse;
	export let chapters: StateChapter[];

	let courseElement: HTMLElement;

	function onSelectCourse() {
		setSelected('course', course.id);
	}
	onSelectCourse();

	let sortingChapters = false;
	async function onSortChapters(e: CustomEvent<StateChapter[]>) {
		const newOrder = e.detail.map((chapter, index) => ({ id: chapter.id, index }));
		sortingChapters = true;
		try {
			await sortChapters(newOrder);
		} catch (e) {
			console.error(e);
			addNotification({
				type: NotificationType.Danger,
				description: (e as Error).message
			});
		} finally {
			sortingChapters = false;
		}
	}
	function getChapterId(chapter: StateChapter) {
		return chapter.id;
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
		<Search
			filter={search}
			{onChange}
			formClass="mt-3 mb-1"
			searchInputClass="me-3"
			placeholder="Filter chapters..."
			searchIcon={true}
		/>
		<ul class="list-group list-group-flush mt-2">
			<li
				bind:this={courseElement}
				class="list-group-item list-group-item-action"
				class:active={$selected === course}
				on:click={onSelectCourse}
			>
				<p class="align-self-center m-0 p-0">{course.name}</p>
			</li>
			<SortableList
				list={filteredChapters}
				disabled={sortingChapters}
				let:id
				let:index
				let:item
				getId={getChapterId}
				on:change={onSortChapters}
			>
				<ChapterTreeItem {id} {index} {search} {department} {course} chapter={item} />
			</SortableList>
		</ul>
	</div>
	<div class="d-flex flex-column flex-grow-1 px-2">
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
