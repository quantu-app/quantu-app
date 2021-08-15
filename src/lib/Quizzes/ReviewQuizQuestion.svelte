<script lang="ts">
	import type { Quiz, Question } from '$lib/api/quantu-app-api';

	export let quiz: Quiz;
	export let questions: Question[];
	export let questionCount: number;
	export let seed: number;
</script>

<div class="container mb-2">
	<h2>{quiz.name}</h2>
	{#each quiz.tags as tag}
		<span class="badge bg-primary me-2">{tag}</span>
	{/each}
</div>
