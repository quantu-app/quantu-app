<script lang="ts">
	import type { Quiz } from '$lib/api/quantu-app-api';
	import RichViewer from '$lib/components/RichViewer.svelte';
	import { nowOffset } from '$lib/utils';

	export let quiz: Quiz;

	$: insertedAt = new Date(quiz.insertedAt);
</script>

<div class="quiz-list-item col-sm-6 col-md-4 col-lg-3 mb-4">
	<div class="card">
		<div class="card-body">
			<h5 class="card-title">{quiz.name}</h5>
			<p class="card-subtitle mb-2 text-muted">Created {nowOffset(insertedAt)}</p>
			{#if quiz.description.length > 0}
				<div class="card-text">
					<RichViewer content={quiz.description} />
				</div>
			{/if}
			<div class="d-flex justify-content-end">
				<a class="btn btn-primary" role="button" aria-label="Study" href={`/quizzes/${quiz.id}`}
					>Study</a
				>
			</div>
		</div>
	</div>
</div>
