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
	import ChallengeList from '$lib/components/Challenges/ChallengeList.svelte';
	import { fuzzyEquals } from '@aicacia/string-fuzzy_equals';
	import Search from '$lib/components/Search.svelte';

	export let questions: Question[];

	let latestQuestion: Question;
	let previousQuestions: Question[] = [];

	$: isFiltered = !!$state.questionNameFilter;
	$: filter = (question: Question) =>
		$state.questionNameFilter ? fuzzyEquals($state.questionNameFilter, question.name) : true;

	$: if (!isFiltered) {
		let maxDate = new Date(null);
		let questionIndex = -1;
		for (let i = 0; i < questions.length; i++) {
			const questionDate = new Date(questions[i].insertedAt);
			if (questionDate > maxDate) {
				maxDate = questionDate;
				questionIndex = i;
			}
		}
		if (questionIndex !== -1) {
			latestQuestion = questions[questionIndex];
			const tmp = questions.slice();
			tmp.splice(questionIndex, 1);
			previousQuestions = tmp;
		} else {
			latestQuestion = null;
			previousQuestions = [];
		}
	}
</script>

<div class="container">
	<Search bind:filter={$state.questionNameFilter} />
</div>

{#if isFiltered}
	<div class="container my-4">
		<ChallengeList questions={questions.filter(filter)} />
	</div>
{:else}
	<div class="container my-4">
		{#if latestQuestion}
			<div class="row">
				<h1>Latest Challenge</h1>
				<hr />
				<ChallengeList questions={[latestQuestion]} />
			</div>
		{/if}
		{#if previousQuestions.length}
			<div class="row">
				<h1>Previous Challenges</h1>
				<hr />
				<ChallengeList questions={previousQuestions} />
			</div>
		{/if}
	</div>
{/if}
