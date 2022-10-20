<script lang="ts">
	import UserLayout from '$lib/components/layouts/UserLayout.svelte';
	import { courses } from '$lib/state/courses';
	import SEO from '$lib/components/SEO/index.svelte';
	import CoursesAll from '$lib/components/courses/CoursesAll.svelte';
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
