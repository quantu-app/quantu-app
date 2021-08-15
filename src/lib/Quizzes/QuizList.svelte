<script lang="ts">
	import type { Quiz } from '$lib/api/quantu-app-api';
	import QuizListItem from '$lib/Quizzes/QuizListItem.svelte';

	export let quizzes: Quiz[];
</script>

<div class="list-group list-group-flush">
	{#each quizzes as quiz}
		<QuizListItem {quiz} />
	{/each}
</div>
