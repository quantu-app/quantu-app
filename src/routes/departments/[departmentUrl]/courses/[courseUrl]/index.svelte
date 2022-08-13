<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async (input) => {
		const response = await authGuard(input);

		if (!isValidStatus(response)) {
			return response;
		}
		const departmentUrl = input.params.departmentUrl;
		const courseUrl = input.params.courseUrl;
		await showDepartmentByUrl(departmentUrl, input.fetch);
		await showCourseByUrl(departmentUrl, courseUrl, input.fetch);
		const chapters = await showChapters(departmentUrl, courseUrl, input.fetch);
		await Promise.all(
			chapters.map((chapter) => showLessons(departmentUrl, courseUrl, chapter.url, input.fetch))
		);

		return {
			props: {
				departmentUrl,
				courseUrl
			}
		};
	};
</script>

<script lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import { isValidStatus } from '$lib/guard/isValidStatus';
	import { showDepartmentByUrl } from '$lib/state/departments';
	import { showCourseByUrl, coursesByUrl } from '$lib/state/courses';
	import UserLayout from '$lib/components/layouts/UserLayout.svelte';
	import { base } from '$app/paths';
	import RichViewer from '$lib/components/editor/RichViewer.svelte';
	import CourseChapter from '$lib/components/courses/CourseChapter.svelte';
	import { showChapters, chaptersByUrl } from '$lib/state/chapters';
	import { sortByIndex } from '$lib/utils';
	import { lessonsByUrl, showLessons } from '$lib/state/lessons';

	export let departmentUrl: string;
	export let courseUrl: string;

	$: course = ($coursesByUrl[departmentUrl] || {})[courseUrl];
	$: chapters = Object.values(($chaptersByUrl[departmentUrl] || {})[courseUrl] || {}).sort(
		sortByIndex
	);
	$: lessonsByChapterUrl = ($lessonsByUrl[departmentUrl] || {})[courseUrl] || {};
</script>

<svelte:head>
	<title>{course.name}</title>
</svelte:head>

<UserLayout>
	<div class="container-full-bg bg-dark py-5">
		<div class="container">
			<div class="row text-white">
				<div class="col-8">
					<a href={`${base}/courses`} class="linkToCourses">
						<span>&lt;</span>
						<span>Back to Courses</span>
					</a>

					<h1 class="mt-3">{course.name}</h1>
					<RichViewer value={course.description} />
				</div>
				<div class="col-4">
					<div class="card darkerBgColor">
						{#if course.logoId}
							<img
								src={`${base}/api/assets/${course.logoId}`}
								alt={course.name}
								class="card-img-top"
							/>
						{/if}
						<div class="card-body">
							<div class="row text-center">
								<div class="col">
									<h4>{chapters.length}</h4>
									<p>Chapters</p>
								</div>
								<div class="col">
									<h4>{course.lessons}</h4>
									<p>Lessons</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="container">
		<div class="row py-4 my-4">
			{#each chapters as chapter, idx}
				<CourseChapter
					{chapter}
					chapterNumber={idx + 1}
					lessons={Object.values(lessonsByChapterUrl[chapter.url] || {})}
				/>
			{/each}
		</div>
	</div>
</UserLayout>

<style>
	a.linkToCourses {
		color: white;
		text-decoration: underline;
	}
	.card.darkerBgColor {
		background: #3e3e3e;
	}
</style>
