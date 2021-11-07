<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import type { LoadInput } from '@sveltejs/kit';
	import { browser } from '$app/env';

	export async function load(input: LoadInput) {
		const response = authGuard(input),
			quizId = parseInt(input.page.params.quizId),
			playId = input.page.params.playId,
			seed = parseInt(input.page.query.get('seed')),
			questionCount = parseInt(input.page.query.get('questionCount'));

		return {
			...response,
			props: {
				quizId,
				playId,
				seed,
				questionCount
			}
		};
	}
</script>

<script lang="ts">
	import { getQuiz, quizzes } from '$lib/state/quizzes';
	import AppLayout from '$lib/AppLayout.svelte';
	import Play from '$lib/Quizzes/Play.svelte';

	export let quizId: number;
	export let playId: string;
	export let seed: number;
	export let questionCount: number;

	$: quiz = $quizzes.byId[quizId];

	if (browser) {
		getQuiz(quizId);
	}
</script>

<svelte:head>
	<title>Quiz</title>
</svelte:head>

<AppLayout
	breadcrumbs={[
		{ href: '/', title: 'Home' },
		{
			href: `/quizzes`,
			title: 'Quizzes'
		},
		{
			href: `/quizzes/${quizId}`,
			title: quiz?.name
		},
		{
			href: `/quizzes/${quizId}/play/${playId}?seed=${seed}&questionCount=${questionCount}`,
			title: `Play ${playId}`
		}
	]}
>
	{#if quiz}
		<Play {quiz} {playId} {seed} {questionCount} />
	{/if}
</AppLayout>
