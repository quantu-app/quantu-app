<svelte:options immutable />

<script lang="ts">
	import type { StateCourse } from '$lib/state/creator/courses';
	import type { StateChapter } from '$lib/state/creator/chapters';
	import type { StateLesson } from '$lib/state/creator/lessons';
	import CreateLessonBlock from './CreateLessonBlock.svelte';
	import type { StateDepartment } from '$lib/state/creator/departments';
	import LessonBlockTreeItem from './LessonBlockTreeItem.svelte';
	import ContextMenu from '$lib/components/ui/ContextMenu.svelte';
	import { setSelected, selected } from './Course.svelte';
	import SortableList from '$lib/components/ui/SortableList.svelte';
	import { addNotification, NotificationType } from '$lib/state/notifications';
	import {
		showLessonBlocks,
		sortLessonBlocks,
		lessonBlocksByLessonId,
		type StateLessonBlock
	} from '$lib/state/creator/lessonBlocks';

	export let id: string;
	export let index: number;
	export let department: StateDepartment;
	export let course: StateCourse;
	export let chapter: StateChapter;
	export let lesson: StateLesson;

	let sortingLessonBlocks = false;
	async function onSortLessons(e: CustomEvent<StateLessonBlock[]>) {
		const newOrder = e.detail.map((lesson, index) => ({ id: lesson.id, index }));
		sortingLessonBlocks = true;
		try {
			await sortLessonBlocks(newOrder);
		} catch (e) {
			console.error(e);
			addNotification({
				type: NotificationType.Danger,
				description: (e as Error).message
			});
		} finally {
			sortingLessonBlocks = false;
		}
	}
	function getLessonBlockId(lessonBlock: StateLessonBlock) {
		return lessonBlock.id;
	}

	let lessonElement: HTMLElement;

	function onSelectInternal() {
		setSelected('lesson', lesson.id);
	}
	let expanded = false;
	function onToggleExpand(e: MouseEvent) {
		e.stopPropagation();
		expanded = !expanded;
	}

	let openCreatingLessonBlock = false;
	function onOpenCreatingLessonBlock(e: MouseEvent) {
		e.stopPropagation();
		openCreatingLessonBlock = true;
	}

	let loaded = false;
	let loading = false;
	$: if (expanded === true && !loading && !loaded) {
		loading = true;
		showLessonBlocks(lesson.id)
			.then(() => {
				loaded = true;
			})
			.finally(() => {
				loading = false;
			});
	}
	$: lessonBlocks = $lessonBlocksByLessonId[lesson.id] || [];
</script>

<li
	bind:this={lessonElement}
	data-id={id}
	data-index={index}
	class="list-group-item list-group-item-action"
	class:active={$selected === lesson}
	on:click={onSelectInternal}
>
	<div class="d-flex flex-row ps-3">
		<button class="btn btn-sm btn-ghost" on:click={onToggleExpand}
			>{#if expanded}<i class="bi bi-caret-down-fill" />{:else}<i
					class="bi bi-caret-right-fill"
				/>{/if}</button
		>
		<p class="d-flex flex-grow-1 align-self-center m-0 p-0">
			{chapter.index + 1}.{lesson.index + 1} - {lesson.name}
		</p>
	</div>
</li>
{#if expanded}
	<ul class="list-group list-group-flush">
		<SortableList
			list={lessonBlocks}
			disabled={sortingLessonBlocks}
			let:id
			let:index
			let:item
			getId={getLessonBlockId}
			on:change={onSortLessons}
		>
			<LessonBlockTreeItem {id} {index} {chapter} {lesson} lessonBlock={item} />
		</SortableList>
	</ul>
{/if}

<ContextMenu target={lessonElement}>
	<li>
		<button class="dropdown-item" on:click={onOpenCreatingLessonBlock}>Add Lesson Block</button>
	</li>
</ContextMenu>

<CreateLessonBlock bind:open={openCreatingLessonBlock} {department} {course} {chapter} {lesson} />
