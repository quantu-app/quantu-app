<svelte:options immutable />

<script lang="ts">
	import type { StateCourse } from '$lib/state/creator/courses';
	import type { StateChapter } from '$lib/state/creator/chapters';
	import {
		showLessonBlocks,
		lessonBlocksByLessonId,
		type StateLessonBlock
	} from '$lib/state/creator/lessonBlocks';
	import type { StateLesson } from '$lib/state/creator/lessons';
	import type { StateDepartment } from '$lib/state/creator/departments';

	export let department: StateDepartment;
	export let course: StateCourse;
	export let chapter: StateChapter;
	export let lesson: StateLesson;
	export let selected: StateCourse | StateChapter | StateLesson | StateLessonBlock;
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

	let openCreatingLessonBlock = false;
	function onOpenCreatingLessonBlock(e: MouseEvent) {
		e.stopPropagation();
		openCreatingLessonBlock = true;
	}

	let openDeletingLesson = false;
	function onOpenDeletingLesson(e: MouseEvent) {
		e.stopPropagation();
		openDeletingLesson = true;
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
		<div class="d-flex flex-grow-1 justify-content-between">
			<p class="d-flex flex-grow-1 align-self-center m-0 p-0">{chapter.name}</p>
			<div class="btn-group" role="group">
				<button class="btn btn-sm btn-secondary" on:click={onOpenCreatingLessonBlock}
					><i class="bi bi-plus" /></button
				>
				<button class="btn btn-sm btn-danger" on:click={onOpenDeletingLesson}
					><i class="bi bi-trash" /></button
				>
			</div>
		</div>
	</div>
</li>
{#if expanded}
	<ul class="list-group list-group-flush">
		{#each lessonBlocks as lessonBlock (lessonBlock.id)}
			{JSON.stringify(lessonBlock)}
		{/each}
	</ul>
{/if}
