<script lang="ts">
	import type { Question } from '$lib/api/quantu-app-api';
	import QuestionListItem from '$lib/Questions/QuestionListItem.svelte';

	export let questions: Question[];

	function sortQuestion(a: Question, b: Question) {
		return a.index - b.index;
	}
</script>

<div class="list-group list-group-flush">
	{#each questions.sort(sortQuestion) as question}
		<QuestionListItem {question} />
	{/each}
</div>
