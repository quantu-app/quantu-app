<script lang="ts">
	import RichViewer from '../editor/RichViewer.svelte';
	import { base } from '$app/paths';

	export let quiz: object;
	export let quizNumber: number;
	export const fallbackImage: string = 'https://loremflickr.com/140/140';
</script>

<div class="card">
	<div class="card-body text-center">
		<div class="img-wrapper ">
			<img
				src={quiz.logoId ? `${base}/api/assets/${quiz.logoId}` : fallbackImage}
				alt={quiz.name}
				class="card-img-top"
			/>
		</div>
		<h4 class="card-title mt-3">Quiz: {quizNumber}</h4>
		<div class="card-text">
			<p>{quiz.name}</p>
		</div>
	</div>
</div>

<style>
	.card {
		height: 260px;
		width: 260px;
	}
	.card-img-top {
		height: 140px;
		width: 140px;
		margin: 0 auto;
	}
</style>
