<svelte:options immutable />

<script lang="ts">
	import type { StateCourse } from '$lib/state/creator/courses';
	import type { StateChapter } from '$lib/state/creator/chapters';
	import type { StateLesson } from '$lib/state/creator/lessons';
	import type { StateLessonBlock } from '$lib/state/creator/lessonBlocks';
	import CourseEditor from './CourseEditor.svelte';
	import ChapterEditor from './ChapterEditor.svelte';
	import type { StateDepartment } from '$lib/state/creator/departments';
	import LessonEditor from './LessonEditor.svelte';

	export let department: StateDepartment;
	export let selected: StateCourse | StateChapter | StateLesson | StateLessonBlock;
</script>

{#if 'department' in selected}
	<CourseEditor {department} course={selected} />
{:else if 'course' in selected}
	<ChapterEditor {department} chapter={selected} />
{:else if 'chapter' in selected}
	<LessonEditor {department} lesson={selected} />
{/if}
