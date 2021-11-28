<script context="module" lang="ts">
	import { writable } from 'svelte/store';

	interface IState {
		courseNameFilter: string | undefined;
	}

	const state = writable<IState>({
		courseNameFilter: undefined
	});
</script>

<script lang="ts">
	import { fuzzyEquals } from '@aicacia/string-fuzzy_equals';
	import ActionBar from '$lib/UserOrganizations/Courses/ActionBar.svelte';
	import CourseList from './CourseList.svelte';
	import type { Course } from '$lib/api/quantu-app-api';
	import Search from '$lib/Search.svelte';

	export let organizationId: number;
	export let courses: Course[];

	$: filter = (course: Course) =>
		$state.courseNameFilter ? fuzzyEquals($state.courseNameFilter, course.name) : true;
</script>

<div class="container mb-2">
	<ActionBar {organizationId} />
	<Search bind:filter={$state.courseNameFilter} />
</div>

<div class="container">
	<CourseList {organizationId} courses={courses.filter(filter)} />
</div>
