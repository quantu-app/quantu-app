<svelte:options immutable />

<script lang="ts">
	import type { StateCourse } from '$lib/state/creator/courses';
	import type { StateChapter } from '$lib/state/creator/chapters';
	import { lessonsByChapterId, showLessons, type StateLesson } from '$lib/state/creator/lessons';
	import { fuzzyEquals } from '@aicacia/string-fuzzy_equals';
	import CreateLesson from './CreateLesson.svelte';
	import type { StateDepartment } from '$lib/state/creator/departments';
	import LessonTreeItem from './LessonTreeItem.svelte';
	import ContextMenu from '$lib/components/ui/ContextMenu.svelte';
	import { setSelected, selected } from './Course.svelte';

	export let department: StateDepartment;
	export let course: StateCourse;
	export let chapter: StateChapter;
	export let search = '';

	let chapterElement: HTMLElement;

	function onSelectInternal() {
		setSelected('chapter', chapter.id);
	}
	let expanded = false;
	function onToggleExpand(e: MouseEvent) {
		e.stopPropagation();
		expanded = !expanded;
	}

	let openCreatingLesson = false;
	function onOpenCreatingLesson(e: MouseEvent) {
		e.stopPropagation();
		openCreatingLesson = true;
	}

	let loaded = false;
	let loading = false;
	$: if (expanded === true && !loading && !loaded) {
		loading = true;
		showLessons(chapter.id)
			.then(() => {
				loaded = true;
			})
			.finally(() => {
				loading = false;
			});
	}
	$: lessons = $lessonsByChapterId[chapter.id] || [];
	$: filterLessons = (chapter: StateLesson) => (search ? fuzzyEquals(search, chapter.name) : true);
	$: filteredLessons = lessons.filter(filterLessons);
</script>

<li
	bind:this={chapterElement}
	class="list-group-item list-group-item-action"
	class:active={$selected === chapter}
	on:click={onSelectInternal}
>
	<div class="d-flex flex-row">
		<button class="btn btn-sm btn-ghost" on:click={onToggleExpand}
			>{#if expanded}<i class="bi bi-caret-down-fill" />{:else}<i
					class="bi bi-caret-right-fill"
				/>{/if}</button
		>
		<p class="d-flex flex-grow-1 align-self-center m-0 p-0">{chapter.name}</p>
	</div>
</li>
{#if expanded}
	<ul class="list-group list-group-flush">
		{#each filteredLessons as lesson (lesson.id)}
			<LessonTreeItem {lesson} />
		{/each}
	</ul>
{/if}

<ContextMenu target={chapterElement}>
	<li><button class="dropdown-item" on:click={onOpenCreatingLesson}>Add Lesson</button></li>
</ContextMenu>

<CreateLesson bind:open={openCreatingLesson} {department} {course} {chapter} />
