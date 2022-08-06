<svelte:options immutable />

<script lang="ts">
	import type { StateCourse } from '$lib/state/creator/courses';
	import type { StateChapter } from '$lib/state/creator/chapters';
	import type { StateLessonBlock } from '$lib/state/creator/lessonBlocks';
	import type { StateLesson } from '$lib/state/creator/lessons';

	export let lesson: StateLesson;
	export let selected: StateCourse | StateChapter | StateLesson | StateLessonBlock;
	export let onSelect: (newSelected: any) => void;

	function onSelectInternal() {
		onSelect(lesson);
	}
</script>

<li
	class="list-group-item list-group-item-action"
	class:active={selected === lesson}
	on:click={onSelectInternal}
>
	<div class="d-flex flex-row ps-4">
		<p class="d-flex flex-grow-1 align-self-center m-0 p-0">{lesson.name}</p>
	</div>
</li>
