<script lang="ts">
	import type { StateLesson } from '$lib/state/lessons';
	import RichViewer from '../editor/RichViewer.svelte';
	import { noImageFallback } from '$lib/utils';
	import { departmentCourseChapterLessonPath, apiAssetPath } from '$lib/routingUtils';

	export let lesson: StateLesson;
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
	</div>
	<div class="card-footer text-muted">
		<span>{lesson.lessonBlocksCount} questions</span>
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
