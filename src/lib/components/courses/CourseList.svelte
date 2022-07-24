<svelte:options immutable />

<script lang="ts">
	import CourseListItem from '$lib/components/challenges/ChallengeListItem.svelte';
	import type { StateCourse } from '$lib/state/courses';

	export let courses: StateCourse[];
</script>

<div class="container">
	<div class="row row-cols-lg-4 row-cols-md-3 row-cols-sm-2">
		{#each courses as course (course.id)}
			<div class="col my-2">
				<CourseListItem {course} />
			</div>
		{/each}
	</div>
</div>
