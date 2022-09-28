<script lang="ts">
	import { completionPercentageInfo, type StateLesson } from '$lib/state/lessons';
	import RichViewer from '../editor/RichViewer.svelte';
	import { noImageFallback } from '$lib/utils';
	import { departmentCourseChapterLessonPath, apiAssetPath } from '$lib/routingUtils';
	import { lessonBlocksByLessonId } from '$lib/state/creator/lessonBlocks';
	import { lessonBlocks } from '$lib/state/lessonBlocks';

	export let lesson: StateLesson;

	$: completionInfo = completionPercentageInfo(lesson);
</script>

<div class="card">
	<div class="card-body">
		<img
			src={lesson.logoId ? apiAssetPath(lesson.logoId) : noImageFallback}
			alt={lesson.name}
			height="160"
			class="card-img-top"
		/>
		<h4 class="card-title mt-3">{lesson.name}</h4>
		<div class="card-text card-body-height">
			<RichViewer value={lesson.description} />
			<!-- svelte-ignore a11y-missing-content -->
			<a
				role="button"
				aria-label="review"
				class="text-success stretched-link"
				href={departmentCourseChapterLessonPath(
					lesson.chapter.course.department.url,
					lesson.chapter.course.url,
					lesson.chapter.url,
					lesson.url
				)}
			/>
		</div>
		<div class="progress mt-4">
			<div
				class="progress-bar bg-success"
				role="progressbar"
				style={`width: ${completionInfo.percentage}%`}
				aria-valuenow={completionInfo.percentage}
				aria-valuemin={0}
				aria-valuemax={100}
			/>
		</div>
	</div>

	<div class="card-footer text-muted">
		{#if completionInfo.completed === 0}
			<span>{lesson.lessonBlocksCount} questions.</span>
		{:else if completionInfo.completed === completionInfo.total}
			<span>Lesson completed.</span>
		{:else}
			<span>{completionInfo.completed} of {completionInfo.total} questions completed.</span>
		{/if}
	</div>
</div>

<style>
	.card-text {
		overflow: hidden;
	}
	.card-body-height {
		height: 90px;
	}
</style>
