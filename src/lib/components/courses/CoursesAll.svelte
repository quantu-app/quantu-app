<svelte:options immutable />

<script lang="ts">
	import CourseList from '$lib/components/courses/CourseList.svelte';
	import type { StateCourse } from '$lib/state/courses';
	import { base } from '$app/paths';

	export let courses: StateCourse[];
</script>

<div class="container my-4 mb-8">
	<a class="link-dark" href={`${base}/courses`}><i class="bi bi-chevron-left" /> Courses</a>
	<hr />
	<div class="row">
		<h2>All Courses</h2>

		<CourseList {courses} />
	</div>
</div>
