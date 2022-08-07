<svelte:options immutable />

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
	import CourseList from './CourseList.svelte';
	import CreateCourse from './CreateCourse.svelte';
	import { fuzzyEquals } from '@aicacia/string-fuzzy_equals';
	import Search from '$lib/components/Search.svelte';
	import type { StateCourse } from '$lib/state/creator/courses';
	import { base } from '$app/paths';
	import type { StateDepartment } from '$lib/state/creator/departments';

	export let department: StateDepartment;
	export let courses: StateCourse[];

	function onChange(courseNameFilter: string) {
		state.update((state) => ({
			...state,
			courseNameFilter
		}));
	}
	$: courseNameFilter = $state.courseNameFilter;
	$: filter = (course: StateCourse) =>
		courseNameFilter ? fuzzyEquals(courseNameFilter, course.name) : true;
	$: filteredCourses = courses.filter(filter);
</script>

<div class="container mb-8">
	<div class="d-flex align-items-center justify-content-end mt-2">
		<CreateCourse {department} />
	</div>
	<Search filter={courseNameFilter} {onChange} />
	<CourseList {department} courses={filteredCourses} />
</div>
