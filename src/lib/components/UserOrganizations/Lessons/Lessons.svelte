<script context="module" lang="ts">
	import { writable } from 'svelte/store';

	interface IState {
		lessonNameFilter: string | undefined;
	}

	const state = writable<IState>({
		lessonNameFilter: undefined
	});
</script>

<script lang="ts">
	import { fuzzyEquals } from '@aicacia/string-fuzzy_equals';
	import LessonList from './LessonList.svelte';
	import type { Lesson } from '$lib/api/quantu-app-api';
	import Search from '$lib/components/Search.svelte';
	import CreateLesson from './CreateLesson.svelte';

	export let organizationId: number;
	export let courseId: number = undefined;
	export let unitId: number = undefined;
	export let lessons: Lesson[];

	$: filter = (lesson: Lesson) =>
		$state.lessonNameFilter ? fuzzyEquals($state.lessonNameFilter, lesson.name) : true;
</script>

<div class="container mb-2">
	<div class="d-flex justify-content-end">
		<CreateLesson {organizationId} {courseId} {unitId} />
	</div>
	<Search bind:filter={$state.lessonNameFilter} />
</div>

<div class="container">
	<LessonList {organizationId} {courseId} {unitId} lessons={lessons.filter(filter)} />
</div>
