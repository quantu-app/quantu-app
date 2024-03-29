<script lang="ts">
	import { coursesPath, apiAssetPath } from '$lib/routingUtils';

	import { authGuard } from '$lib/guard/authGuard';

	import { showDepartmentByUrl } from '$lib/state/departments';
	import { showCourseByUrl, coursesByUrl } from '$lib/state/courses';
	import UserLayout from '$lib/components/layouts/UserLayout.svelte';
	import RichViewer from '$lib/components/editor/RichViewer.svelte';
	import CourseChapter from '$lib/components/courses/CourseChapter.svelte';
	import { showChapters, chaptersByUrl } from '$lib/state/chapters';
	import { sortByIndex, noImageFallback } from '$lib/utils';
	import { lessonsByUrl, showLessons, type StateLesson } from '$lib/state/lessons';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ departmentUrl, courseUrl } = data);

	function getLessonCount(lessonsByChapterUrl: {
		[chapterUrl: string]: { [url: string]: StateLesson };
	}) {
		let count = 0;
		for (let chapterUrl in lessonsByChapterUrl) {
			const lessonCount = Object.values(lessonsByChapterUrl[chapterUrl]).length;
			count += lessonCount;
		}
		return count;
	}

	$: course = ($coursesByUrl[departmentUrl] || {})[courseUrl];
	$: chapters = Object.values(($chaptersByUrl[departmentUrl] || {})[courseUrl] || {}).sort(
		sortByIndex
	);
	$: lessonsByChapterUrl = ($lessonsByUrl[departmentUrl] || {})[courseUrl] || {};
	$: lessonCount = getLessonCount(lessonsByChapterUrl); // TODO: simplify this
</script>

<svelte:head>
	<title>{course.name}</title>
</svelte:head>

<UserLayout>
	<div class="container-full-bg bg-dark py-5">
		<div class="container">
			<div class="row text-white">
				<div class="col-8 col-xl-7">
					<a href={coursesPath()} class="linkToCourses">
						<span>&lt;</span>
						<span>Back to Courses</span>
					</a>

					<h1 class="mt-3">{course.name}</h1>
					<RichViewer value={course.description} />
				</div>
				<div class="col-4 offset-xl-1">
					<div class="card darkerBgColor">
						<img
							src={course.logoId ? apiAssetPath(course.logoId) : noImageFallback}
							alt={course.name}
							class="card-img-top"
						/>
						<div class="card-body">
							<div class="row text-center mt-3">
								<div class="col">
									<h4 class="mb-0">{chapters.length}</h4>
									<h5>Chapters</h5>
								</div>
								<div class="col">
									<h4 class="mb-0">{lessonCount}</h4>
									<h5>Lessons</h5>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="container">
		{#each chapters as chapter, idx}
			<div class="row py-4 my-4">
				<CourseChapter
					{chapter}
					chapterNumber={idx + 1}
					lessons={Object.values(lessonsByChapterUrl[chapter.url] || {})}
				/>
			</div>
		{/each}
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
