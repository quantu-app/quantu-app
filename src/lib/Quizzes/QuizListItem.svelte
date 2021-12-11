<script lang="ts">
	import type { Quiz } from '$lib/api/quantu-app-api';
	import RichViewer from '$lib/RichViewer.svelte';
	import { nowOffset } from '$lib/utils';

	export let quiz: Quiz;

	$: insertedAt = new Date(quiz.insertedAt);
</script>

<div class="col">
	<div class="card">
		<div class="card-body">
			<h5 class="card-title">{quiz.name}</h5>
			<p class="card-subtitle mb-2 text-muted">Created {nowOffset(insertedAt)}</p>
			{#if quiz.description.length > 0}
				<div class="card-text">
					<RichViewer content={quiz.description} />
				</div>
			{/if}
			<a aria-label="Study" href={`/quizzes/${quiz.id}`}>Study</a>
		</div>
	</div>
</div>
