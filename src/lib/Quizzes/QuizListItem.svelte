<script lang="ts">
	import type { Quiz } from '$lib/api/quantu-app-api';
	import { nowOffset } from '$lib/utils';

	export let quiz: Quiz;

	$: insertedAt = new Date(quiz.insertedAt);
</script>

<div class="list-group-item">
	<div class="d-flex w-100 justify-content-between">
		<h4>
			<a aria-label="Edit" href={`/quizzes/${quiz.id}`}>{quiz.name}</a>
		</h4>
		<div>
			Created {nowOffset(insertedAt)}
		</div>
	</div>
	<div class="d-flex justify-content-between align-items-start">
		<div class="d-inline">
			{quiz.description}
		</div>
	</div>
</div>
