<svelte:options immutable />

<script lang="ts">
	import CourseList from '$lib/components/courses/CourseList.svelte';
	import type { StateCourse } from '$lib/state/courses';

	export let topCourses: StateCourse[];
	export let coursesByDepartments: {
		url: string;
		name: string;
		courses: StateCourse[];
	}[];
</script>

<div class="container my-4 mb-8">
	{#if topCourses.length}
		<div class="row">
			<h2>Newest Courses</h2>

			<CourseList courses={topCourses} />
		</div>
		<div class="row mt-3 text-end">
			<a class="viewAllChallenges" href="/courses/all">
				<span class="linkText">View All Courses</span>
				<span class="linkArrow"> &gt; </span>
			</a>
		</div>
	{/if}
	<hr />
	{#if coursesByDepartments.length}
		{#each coursesByDepartments as depCourses (depCourses.url)}
			<div class="row mt-4">
				<h2>{depCourses.name}</h2>
				<CourseList courses={depCourses.courses} />
			</div>
		{/each}
	{/if}
</div>

<style>
	a.viewAllChallenges {
		color: black;
		text-decoration: none;
	}
	a.viewAllChallenges .linkText {
		text-decoration: underline;
	}
	a.viewAllChallenges .linkArrow {
		text-decoration: none;
	}
</style>
