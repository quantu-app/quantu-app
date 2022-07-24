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
</script>

<script lang="ts">
	import CoursesMain from '$lib/components/courses/CoursesMain.svelte';
	import UserLayout from '$lib/components/layouts/UserLayout.svelte';
	import SEO from '$lib/components/SEO/index.svelte';
	import { isValidStatus } from '$lib/guard/isValidStatus';
	import {
		showAllCourses,
		courses,
		type StateCourse,
		coursesByDepartment
	} from '$lib/state/courses';
	import { sortByCreatedAt } from '$lib/utils';

	$: topCourses = $courses.sort(sortByCreatedAt).slice(0, 4);
	$: allCoursesByDepartment = Object.values($coursesByDepartment);

	$: console.log(topCourses);
</script>

<SEO
	title="Courses"
	description="University level problems requiring reasoning to solve."
	keywords="courses"
	robotsDirectives={['all']}
/>

<UserLayout>
	<CoursesMain {topCourses} coursesByDepartments={allCoursesByDepartment} courses={[]} />
</UserLayout>
