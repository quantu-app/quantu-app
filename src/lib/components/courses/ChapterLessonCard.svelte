<script lang="ts">
	import type { StateLesson } from '$lib/state/lessons';
	import RichViewer from '../editor/RichViewer.svelte';
	import { base } from '$app/paths';

	export let lesson: StateLesson;
</script>

<div class="card">
	<div class="card-body">
		{#if lesson.logoId}
			<img src={`${base}/api/assets/${lesson.logoId}`} alt={lesson.name} class="card-img-top" />
		{/if}
		<h5 class="card-title mt-3">{lesson.name}</h5>
		<div class="card-text">
			<RichViewer value={lesson.description} />
			<a
				role="button"
				aria-label="review"
				class="text-success stretched-link"
				href={`${base}/departments/${lesson.chapter.course.department.url}/courses/${lesson.chapter.course.url}/chapters/${lesson.chapter.url}/lessons/${lesson.url}`}
			/>
		</div>
	</div>
	<div class="card-footer text-muted">
		<span>{lesson.blocks} questions</span>
	</div>
</div>
