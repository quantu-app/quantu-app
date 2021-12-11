<script lang="ts">
	import type { Quiz } from '$lib/api/quantu-app-api';
	import QuizListItem from '$lib/Quizzes/QuizListItem.svelte';

	export let quizzes: Quiz[];
</script>

<div class="container">
	<div class="row row-cols-1 row-cols-sm-2 row-cols-md-4">
		{#each quizzes as quiz}
			<QuizListItem {quiz} />
		{/each}
	</div>
</div>
