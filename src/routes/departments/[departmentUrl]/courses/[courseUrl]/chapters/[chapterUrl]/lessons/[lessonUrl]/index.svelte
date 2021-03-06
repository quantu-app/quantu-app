<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async (input) => {
		const response = await authGuard(input);

		if (!isValidStatus(response)) {
			return response;
		}
		const departmentUrl = input.params.departmentUrl;
		const courseUrl = input.params.courseUrl;
		const chapterUrl = input.params.chapterUrl;
		const lessonUrl = input.params.lessonUrl;
		const department = await showDepartmentByUrl(departmentUrl, input.fetch);
		const course = await showCourseByUrl(departmentUrl, courseUrl, input.fetch);
		const chapter = await showChapterByUrl(departmentUrl, courseUrl, chapterUrl, input.fetch);
		const lesson = await showLessonByUrl(
			departmentUrl,
			courseUrl,
			chapterUrl,
			lessonUrl,
			input.fetch
		);
		await showLessonBlocks(departmentUrl, courseUrl, chapterUrl, lessonUrl, input.fetch);

		return {
			props: {
				departmentUrl,
				courseUrl,
				chapterUrl,
				lessonUrl
			}
		};
	};
</script>

<script lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import { isValidStatus } from '$lib/guard/isValidStatus';
	import { departmentsByUrl, showDepartmentByUrl } from '$lib/state/departments';
	import { coursesByUrl, showCourseByUrl } from '$lib/state/courses';
	import { chaptersByUrl, showChapterByUrl } from '$lib/state/chapters';
	import { lessonsByUrl, showLessonByUrl } from '$lib/state/lessons';
	import { lessonBlocksByUrl, showLessonBlocks } from '$lib/state/lesson-blocks';
	import PublicLayout from '$lib/components/layouts/PublicLayout.svelte';

	export let departmentUrl: string;
	export let courseUrl: string;
	export let chapterUrl: string;
	export let lessonUrl: string;

	$: department = $departmentsByUrl[departmentUrl];
	$: course = ($coursesByUrl[departmentUrl] || {})[courseUrl];
	$: chapter = (($chaptersByUrl[departmentUrl] || {})[courseUrl] || {})[chapterUrl];
	$: lesson = ((($lessonsByUrl[departmentUrl] || {})[courseUrl] || {})[chapterUrl] || {})[
		lessonUrl
	];
	$: lessonBlocks =
		((($lessonBlocksByUrl[departmentUrl] || {})[courseUrl] || {})[chapterUrl] || {})[lessonUrl] ||
		[];
</script>

<svelte:head>
	<title>Creator Studio - {chapter.name}</title>
</svelte:head>

<PublicLayout />
