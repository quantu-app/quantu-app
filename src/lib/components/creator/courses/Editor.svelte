<svelte:options immutable />

<script lang="ts">
	import CourseEditor from './CourseEditor.svelte';
	import ChapterEditor from './ChapterEditor.svelte';
	import LessonEditor from './LessonEditor.svelte';
	import { selected } from './Course.svelte';
	import LessonBlockEditor from './LessonBlockEditor.svelte';

	$: value = $selected;
</script>

{#if value}
	{#if 'department' in value}
		<CourseEditor course={value} />
	{:else if 'course' in value}
		<ChapterEditor chapter={value} />
	{:else if 'chapter' in value}
		<LessonEditor lesson={value} />
	{:else if 'lesson' in value}
		<LessonBlockEditor lessonBlock={value} />
	{/if}
{/if}
