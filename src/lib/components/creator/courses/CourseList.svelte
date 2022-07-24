<svelte:options immutable />

<script lang="ts">
	import CourseListItem from './CourseListItem.svelte';
	import type { StateCourse } from '$lib/state/creator/courses';
	import type { StateDepartment } from '$lib/state/creator/departments';

	export let department: StateDepartment;
	export let courses: StateCourse[];
</script>

<div class="container p-0">
	<div class="row">
		{#each courses as course (course.id)}
			<CourseListItem {department} {course} />
		{/each}
	</div>
</div>
