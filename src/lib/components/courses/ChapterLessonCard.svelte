<script lang="ts">
	import type { StateLesson } from '$lib/state/lessons';
	import RichViewer from '../editor/RichViewer.svelte';
	import { base } from '$app/paths';

	export let lesson: StateLesson;
	export const fallbackImage: string = 'https://loremflickr.com/320/180';
</script>

<div class="card">
	<div class="card-body">
		<img
			src={lesson.logoId ? `${base}/api/assets/${lesson.logoId}` : fallbackImage}
			alt={lesson.name}
			class="card-img-top"
		/>
		<h5 class="card-title mt-3">{lesson.name}</h5>
		<div class="card-text">
			<RichViewer value={lesson.description} />
		</div>
	</div>
	<div class="card-footer text-muted">
		<span>{lesson.totalQuestions} questions</span>
		<span>+{lesson.exp} EXP</span>
	</div>
</div>

<style>
	.card {
		height: 360px;
	}
</style>
