<script lang="ts">
	import {
		departmentCoursePath,
		departmentCourseChapterLessonLessonBlockPath,
		departmentCourseChapterLessonPath
	} from '$lib/routingUtils';

	import { departmentsByUrl } from '$lib/state/departments';
	import { coursesByUrl } from '$lib/state/courses';
	import { chaptersByUrl } from '$lib/state/chapters';
	import { lessonsByUrl } from '$lib/state/lessons';
	import { lessonBlocksByUrl, type StateLessonBlock } from '$lib/state/lessonBlocks';
	import LessonLayout from '$lib/components/layouts/LessonLayout.svelte';
	import LessonProgressMenu from '$lib/components/lessons/LessonProgressMenu.svelte';
	import LearningBlockWrapper from '$lib/components/lesson_block/LessonBlockWrapper.svelte';
	import LessonBlock from '$lib/components/lesson_block/LessonBlock.svelte';
	import { sortByIndex } from '$lib/utils';
	import LessonBlockReview from '$lib/components/lesson_block/LessonBlockReview.svelte';
	import { config } from '$lib/config';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ departmentUrl, courseUrl, chapterUrl, lessonUrl, lessonBlockUrl } = data);

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
		correct: boolean;
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
			correct: !!value.result && value.result.value >= config.lessons.ANSWER_CORRECT_THRESHOLD,
			completed: !!value.result,
			current: value.url == lessonBlockUrl
		};
	});

	function findNextLessonBlockUrl(lessonBlocks: StateLessonBlock[]): string | undefined {
		const isDone = lessonBlocks.every((lessonBlock) => !!lessonBlock.result);
		if (isDone) {
			return undefined;
		}
		const firstUnfinishedLessonBlock = lessonBlocks.find((lb) => !lb.result);
		return firstUnfinishedLessonBlock?.url;
	}

	$: nextLessonBlockUrl = findNextLessonBlockUrl(lessonBlocks);
	$: nextUrl =
		nextLessonBlockUrl === undefined
			? departmentCourseChapterLessonPath(department.url, course.url, chapter.url, lesson.url)
			: departmentCourseChapterLessonLessonBlockPath(
					department.url,
					course.url,
					chapter.url,
					lesson.url,
					nextLessonBlockUrl
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
		<LessonProgressMenu {lessonBlockMenuItems} />
		<div class="row main-learning-area">
			<LearningBlockWrapper {lessonBlock}>
				{#if lessonBlock.result}
					<LessonBlockReview result={lessonBlock.result}>
						<svelte:fragment slot="extra">
							{#if nextLessonBlockUrl}
								<a role="button" class="btn btn-outline-primary" href={nextUrl}>Continue</a>
							{:else}
								<a role="button" class="btn btn-outline-primary" href={nextUrl}>Finish Lesson</a>
							{/if}
						</svelte:fragment>
					</LessonBlockReview>
				{:else}
					<LessonBlock {lessonBlock}>
						<svelte:fragment slot="extra">
							{#if nextLessonBlockUrl}
								<a role="button" class="btn btn-outline-primary" href={nextUrl}>Continue</a>
							{:else}
								<a role="button" class="btn btn-outline-primary" href={nextUrl}>Finish Lesson</a>
							{/if}
						</svelte:fragment>
					</LessonBlock>
				{/if}
			</LearningBlockWrapper>
		</div>
	</div>
</LessonLayout>
