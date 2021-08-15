<script context="module" lang="ts">
	import { writable } from 'svelte/store';

	interface IState {
		quizNameFilter: string | undefined;
	}

	const state = writable<IState>({
		quizNameFilter: undefined
	});
</script>

<script lang="ts">
	import { fuzzyEquals } from '@aicacia/string-fuzzy_equals';
	import QuizList from '$lib/Quizzes/QuizList.svelte';
	import type { Quiz } from '$lib/api/quantu-app-api';
	import Search from '$lib/Search.svelte';

	export let quizzes: Quiz[];

	$: filter = (quiz: Quiz) =>
		$state.quizNameFilter ? fuzzyEquals($state.quizNameFilter, quiz.name) : true;
</script>

<div class="container mb-2">
	<Search bind:filter={$state.quizNameFilter} />
</div>

<div class="container">
	<QuizList quizzes={quizzes.filter(filter)} />
</div>
