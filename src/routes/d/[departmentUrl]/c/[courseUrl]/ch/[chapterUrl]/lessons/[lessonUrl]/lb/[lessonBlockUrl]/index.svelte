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
		const lessonBlockUrl = input.params.lessonBlockUrl;
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
				lessonUrl,
				lessonBlockUrl
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
	import {
		departmentCoursePath,
		departmentCourseChapterLessonLessonBlockPath,
		departmentCourseChapterLessonPath
	} from '$lib/routingUtils';
	import { sortByIndex } from '$lib/utils';

	export let departmentUrl: string;
	export let courseUrl: string;
	export let chapterUrl: string;
	export let lessonUrl: string;
	export let lessonBlockUrl: string;

	$: department = $departmentsByUrl[departmentUrl];
	$: course = ($coursesByUrl[departmentUrl] || {})[courseUrl];
	$: chapter = (($chaptersByUrl[departmentUrl] || {})[courseUrl] || {})[chapterUrl];
	$: lesson = ((($lessonsByUrl[departmentUrl] || {})[courseUrl] || {})[chapterUrl] || {})[
		lessonUrl
	];
	$: lessonBlocks = Object.values(
		((($lessonBlocksByUrl[departmentUrl] || {})[courseUrl] || {})[chapterUrl] || {})[lessonUrl] ||
			{}
	).sort(sortByIndex);
	$: lessonBlock = (((($lessonBlocksByUrl[departmentUrl] || {})[courseUrl] || {})[chapterUrl] ||
		{})[lessonUrl] || {})[lessonBlockUrl];

	let lessonBlockMenuItems: {
		name: string;
		url: string;
		current: boolean;
		completed: boolean;
	}[];

	$: lessonBlockMenuItems = lessonBlocks.map((value) => {
		return {
			name: value.name,
			url: departmentCourseChapterLessonLessonBlockPath(
				department.url,
				course.url,
				chapter.url,
				lesson.url,
				value.url
			),
			completed: !!value.result,
			current: value.url == lessonBlockUrl
		};
	});

	$: isDone = lessonBlocks.every((lessonBlock) => !!lessonBlock.result);
	// TODO: make this a true next
	$: nextUrl = isDone
		? departmentCourseChapterLessonPath(department.url, course.url, chapter.url, lesson.url)
		: departmentCourseChapterLessonLessonBlockPath(
				department.url,
				course.url,
				chapter.url,
				lesson.url,
				lessonBlocks.find((lessonBlock) => !lessonBlock.result)?.url as string
		  );
</script>

<svelte:head>
	<title>Lesson | {lesson.name}</title>
</svelte:head>

<LessonLayout
	returnRoute={departmentCoursePath(department.url, course.url)}
	lessonName={lesson.name}
>
	<div class="container">
		<div class="row my-4">
			<LessonProgressMenu {lessonBlockMenuItems} />
		</div>
		<div class="row main-learning-area">
			<LearningBlockWrapper {lessonBlock}>
				<LessonBlock {lessonBlock}>
					<svelte:fragment slot="extra">
						<a role="button" class="btn btn-outline-primary" href={nextUrl}>Continue</a>
					</svelte:fragment>
				</LessonBlock>
			</LearningBlockWrapper>
		</div>
	</div>
</LessonLayout>
