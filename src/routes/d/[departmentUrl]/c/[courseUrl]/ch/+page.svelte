<script lang="ts">
	import UserLayout from '$lib/components/layouts/PublicLayout.svelte';
	import { authGuard } from '$lib/guard/authGuard';

	import { departmentsByUrl, showDepartmentByUrl } from '$lib/state/departments';
	import { coursesByUrl, showCourseByUrl } from '$lib/state/courses';
	import { chaptersByUrl, showChapters } from '$lib/state/chapters';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ departmentUrl, courseUrl } = data);

	$: department = $departmentsByUrl[departmentUrl];
	$: course = ($coursesByUrl[departmentUrl] || {})[courseUrl];
	$: chapters = Object.values(($chaptersByUrl[departmentUrl] || {})[courseUrl] || {});
</script>

<svelte:head>
	<title>Chapters</title>
</svelte:head>

<UserLayout />
