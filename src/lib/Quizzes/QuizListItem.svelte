<script lang="ts">
	import type { Quiz } from '$lib/api/quantu-app-api';

	export let quiz: Quiz;

	$: updatedAt = new Date(quiz.updatedAt || '');
</script>

<div class="list-group-item">
	<div class="d-flex w-100 justify-content-between">
		<h4>
			<a aria-label="Edit" href={`/quizzes/${quiz.id}`}>{quiz.name}</a>
		</h4>
	</div>
	<div class="d-flex justify-content-between align-items-start">
		<div class="d-inline">
			Last updated {updatedAt.toLocaleTimeString()}
			{updatedAt.toLocaleDateString()}
		</div>
	</div>
</div>
