<script lang="ts">
	import UserLayout from '$lib/components/layouts/PublicLayout.svelte';
	import { authGuard } from '$lib/guard/authGuard';

	import { departmentsByUrl, showDepartmentByUrl } from '$lib/state/departments';
	import { coursesByUrl, showCourseByUrl } from '$lib/state/courses';
	import { chaptersByUrl, showChapterByUrl } from '$lib/state/chapters';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ departmentUrl, courseUrl, chapterUrl } = data);

	$: department = $departmentsByUrl[departmentUrl];
	$: course = ($coursesByUrl[departmentUrl] || {})[courseUrl];
	$: chapter = (($chaptersByUrl[departmentUrl] || {})[courseUrl] || {})[chapterUrl];
</script>

<svelte:head>
	<title>{chapter.name}</title>
</svelte:head>

<UserLayout />
