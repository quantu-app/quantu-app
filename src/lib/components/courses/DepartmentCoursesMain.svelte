<svelte:options immutable />

<script lang="ts">
	import CourseList from '$lib/components/courses/CourseList.svelte';
	import type { StateCourse } from '$lib/state/courses';

	export let newestCourses: StateCourse[];
	export let courses: StateCourse[];
</script>

<div class="container my-4 mb-8">
	<div class="row">
		<h2>Newest Courses</h2>
		{#if newestCourses && newestCourses.length}
			<CourseList courses={newestCourses} />
		{/if}
	</div>
	<hr />
	{#if courses && courses.length}
		<CourseList {courses} />
	{/if}
</div>
