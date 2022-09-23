<script lang="ts">
	import type { StateLesson } from '$lib/state/lessons';
	import type { StateLessonBlock } from '$lib/state/lessonBlocks';
	import RichViewer from '../editor/RichViewer.svelte';
	import { noImageFallback } from '$lib/utils';
	import { apiAssetPath } from '$lib/routingUtils';

	export let lesson: StateLesson;
	export let lessonBlocks: StateLessonBlock[];

	let lessonBlocksCompleted = lessonBlocks.filter((v) => !!v.result).length;
	let percentageComplete = (lessonBlocksCompleted / lessonBlocks.length) * 100;
</script>

<div class="card mx-auto" style="width: 22rem;">
	<div class="card-body">
		<img
			src={lesson.logoId ? apiAssetPath(lesson.logoId) : noImageFallback}
			alt={lesson.name}
			height="160"
			class="card-img-top"
		/>
		<h4 class="card-title mt-3 text-center">{lesson.name}</h4>
		<div class="card-text card-body-height">
			<RichViewer value={lesson.description} />
		</div>
		<div class="progress">
			<div
				class="progress-bar bg-success"
				role="progressbar"
				style={`width: ${percentageComplete}%`}
				aria-valuenow={percentageComplete}
				aria-valuemin={0}
				aria-valuemax={100}
			/>
		</div>
	</div>
</div>

<style>
	.card-text {
		overflow: hidden;
	}
	.card-body-height {
		height: 160px;
	}
</style>
