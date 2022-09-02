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
	import { lessonBlocksByUrl, showLessonBlocks } from '$lib/state/lessonBlocks';
	import LessonLayout from '$lib/components/layouts/LessonLayout.svelte';
	import LessonProgressMenu from '$lib/components/lessons/LessonProgressMenu.svelte';

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
	// $: learningBlocks =
	// 	((($lessonBlocksByUrl[departmentUrl] || {})[courseUrl] || {})[chapterUrl] || {})[lessonUrl] ||
	// 	[];

	let learningBlockMenuItems: {
		name: string;
		url: string;
		current: boolean;
		completed: boolean;
	}[] = [];

	for (let i = 0; i < 40; i++) {
		let completed = i < 15 ? true : Math.random() > 0.5;

		learningBlockMenuItems.push({
			name: `Dummy ${i}`,
			url: `dummy-${i}`,
			completed: completed,
			current: false
		});
	}
	learningBlockMenuItems[12].current = true;
</script>

<svelte:head>
	<title>Lesson | {lesson.name}</title>
</svelte:head>

<LessonLayout>
	<div class="container">
		<div class="my-4">
			<LessonProgressMenu {learningBlockMenuItems} />
		</div>
		<div class="main-learning-area" />
	</div>
</LessonLayout>
