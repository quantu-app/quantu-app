<script lang="ts">
	import type { Quiz } from '$lib/api/quantu-app-api';
	import QuizListItem from '$lib/Quizzes/QuizListItem.svelte';

	export let quizzes: Quiz[];
</script>

<div class="container">
	<div class="row quiz-list">
		{#each quizzes as quiz}
			<QuizListItem {quiz} />
		{/each}
	</div>
</div>
