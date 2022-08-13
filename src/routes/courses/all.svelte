<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async (input) => {
		const response = await authGuard(input);
		if (!isValidStatus(response)) {
			return response;
		}
		await showAllCourses(input.fetch);
		return response;
	};

	function sortByDate(a: StateCourse, b: StateCourse) {
		return a.createdAt < b.createdAt ? 1 : -1;
	}
</script>

<script lang="ts">
	import UserLayout from '$lib/components/layouts/UserLayout.svelte';
	import { showAllCourses, courses, type StateCourse } from '$lib/state/courses';
	import SEO from '$lib/components/SEO/index.svelte';
	import CoursesAll from '$lib/components/courses/CoursesAll.svelte';
	import { isValidStatus } from '$lib/guard/isValidStatus';
</script>

<SEO
	title="All Courses"
	description="University level problems requiring reasoning to solve."
	keywords="courses, interactive lessons, reasoning puzzles and quizzes"
	robotsDirectives={['all']}
/>

<UserLayout>
	<CoursesAll courses={$courses} />
</UserLayout>
