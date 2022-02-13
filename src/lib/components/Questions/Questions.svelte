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
	import type { Question } from '$lib/api/quantu-app-api';
	import QuestionList from '$lib/components/Questions/QuestionList.svelte';
	import { fuzzyEquals } from '@aicacia/string-fuzzy_equals';
	import Search from '$lib/components/Search.svelte';

	export let questions: Question[];

	$: filter = (question: Question) =>
		$state.questionNameFilter ? fuzzyEquals($state.questionNameFilter, question.name) : true;
</script>

<div class="container">
	<Search bind:filter={$state.questionNameFilter} />
</div>

<div class="container">
	<QuestionList questions={questions.filter(filter)} />
</div>
