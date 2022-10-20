<script lang="ts">
	import CoursesMain from '$lib/components/courses/CoursesMain.svelte';
	import UserLayout from '$lib/components/layouts/UserLayout.svelte';
	import SEO from '$lib/components/SEO/index.svelte';
	import { courses, type StateCourse, coursesByDepartment } from '$lib/state/courses';
	import { sortByCreatedAt } from '$lib/utils';

	$: topCourses = $courses.sort(sortByCreatedAt).slice(0, 4);
	$: allCoursesByDepartment = Object.values($coursesByDepartment);
</script>

<SEO
	title="Courses"
	description="University level problems requiring reasoning to solve."
	keywords="courses"
	robotsDirectives={['all']}
/>

<UserLayout>
	<CoursesMain {topCourses} coursesByDepartments={allCoursesByDepartment} />
</UserLayout>
