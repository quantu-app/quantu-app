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
	import SEO from '$lib/components/SEO/index.svelte';
	import { isValidStatus } from '$lib/guard/isValidStatus';
	import {
		showAllCourses,
		courses,
		type StateCourse,
		coursesByDepartment
	} from '$lib/state/courses';

	$: topCourses = $courses.sort(sortByDate).slice(0, 4);
	$: allCoursesByDepartment = Object.values($coursesByDepartment);
</script>

<SEO
	title="Courses"
	description="University level problems requiring reasoning to solve."
	keywords="courses"
	robotsDirectives={['all']}
/>

<UserLayout />
