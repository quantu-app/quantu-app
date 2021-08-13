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
	import QuestionList from './QuestionList.svelte';
	import CreateQuestion from './CreateQuestion.svelte';
	import { fuzzyEquals } from '@aicacia/string-fuzzy_equals';
	import Search from '$lib/Search.svelte';

	export let organizationId: number;
	export let questions: Question[];

	$: filter = (question: Question) =>
		$state.questionNameFilter ? fuzzyEquals($state.questionNameFilter, question.name) : true;
</script>

<div class="container">
	<div class="d-flex justify-content-end">
		<CreateQuestion {organizationId} quizId={null} />
	</div>
	<Search bind:filter={$state.questionNameFilter} />
</div>

<div class="container">
	<QuestionList {organizationId} questions={questions.filter(filter)} />
</div>
