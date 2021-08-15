<script context="module" lang="ts">
	import { writable } from 'svelte/store';

	interface IState {
		questionNameFilter: string | undefined;
	}

	const state = writable<IState>({
		questionNameFilter: undefined
	});
</script>

<script lang="ts">
	import type { Quiz, Question } from '$lib/api/quantu-app-api';
	import Search from '$lib/Search.svelte';
	import QuestionList from '$lib/Questions/QuestionList.svelte';
	import { fuzzyEquals } from '@aicacia/string-fuzzy_equals';

	export let quiz: Quiz;
	export let questions: Question[];

	$: filter = (question: Question) =>
		$state.questionNameFilter ? fuzzyEquals($state.questionNameFilter, question.name) : true;
</script>

<div class="container mb-2">
	<h3>{quiz.name}</h3>
</div>

<div class="container">
	<Search bind:filter={$state.questionNameFilter} />
</div>
<div class="container">
	<QuestionList questions={questions.filter(filter)} />
</div>
