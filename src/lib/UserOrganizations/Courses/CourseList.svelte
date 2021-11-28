<script lang="ts">
	import type { Course } from '$lib/api/quantu-app-api';
	import { deleteCourse } from '$lib/state/organizationCourses';
	import DeleteCourse from './DeleteCourse.svelte';
	import CourseListItem from './CourseListItem.svelte';

	export let organizationId: number;
	export let courses: Course[];

	let courseToDelete: Course;

	function createOnDelete(course: Course) {
		return function onDelete() {
			courseToDelete = course;
		};
	}

	async function onDeleteCourse() {
		if (courseToDelete) {
			await deleteCourse(organizationId, courseToDelete.id);
			courseToDelete = undefined;
		}
	}
</script>

<div class="list-group list-group-flush">
	{#each courses as course (course.id)}
		<CourseListItem {course} onDelete={createOnDelete(course)} />
	{/each}
</div>

<DeleteCourse course={courseToDelete} {onDeleteCourse} />
