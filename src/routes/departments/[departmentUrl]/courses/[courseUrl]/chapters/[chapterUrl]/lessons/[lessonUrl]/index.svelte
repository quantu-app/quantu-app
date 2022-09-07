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
	import LearningBlockWrapper from '$lib/components/lesson_block/LessonBlockWrapper.svelte';
	import LessonBlock from '$lib/components/lesson_block/LessonBlock.svelte';

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
	$: currentLessonBlock = lessonBlocks[0];

	let lessonBlockMenuItems: {
		name: string;
		url: string;
		current: boolean;
		completed: boolean;
	}[] = [];

	for (let i = 0; i < 40; i++) {
		let completed = i < 15 ? true : Math.random() > 0.5;

		lessonBlockMenuItems.push({
			name: `Dummy ${i}`,
			url: `dummy-${i}`,
			completed: completed,
			current: false
		});
	}
	lessonBlockMenuItems[12].current = true;
</script>

<svelte:head>
	<title>Lesson | {lesson.name}</title>
</svelte:head>

<LessonLayout>
	<div class="container">
		<div class="row my-4">
			<LessonProgressMenu {lessonBlockMenuItems} />
		</div>
		<div class="row main-learning-area">
			<LearningBlockWrapper lessonBlock={currentLessonBlock}>
				<LessonBlock lessonBlock={currentLessonBlock} />
			</LearningBlockWrapper>
		</div>
	</div>
</LessonLayout>
