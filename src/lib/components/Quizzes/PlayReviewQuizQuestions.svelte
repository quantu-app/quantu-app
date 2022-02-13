<script lang="ts">
	import type { QuestionResult } from '$lib/api/quantu-app-api';
	import type { Quiz } from '$lib/api/quantu-app-api';
	import FlashCardReview from '$lib/components/Questions/FlashCardReview.svelte';
	import InputReview from '$lib/components/Questions/InputReview.svelte';
	import MultipleChoiceReview from '$lib/components/Questions/MultipleChoiceReview.svelte';
	import { IQuestionResults, IResults, IUser, IUsers, playGraph } from '$lib/state/play';
	import { currentUser } from '$lib/state/user';
	import { toPercent } from '$lib/utils';
	import { Ref } from '@aicacia/graph';
	import { onMount } from 'svelte';
	import QuizState from './QuizState.svelte';

	export let playId: string;
	export let quiz: Quiz;
	export let questionResults: QuestionResult[] = [];

	$: currentUserId = $currentUser?.id;
	$: roomRef = playGraph.get('rooms').get(playId);
	$: userRef = roomRef.get('users').get(currentUserId);
	let users: IUsers = {};
	$: userList = Array.from(Object.entries(users)) as [id: string, user: IUser][];
	let results: IResults = {};

	let prevUserId: string;
	$: if (prevUserId !== currentUserId && currentUserId) {
		if (prevUserId) {
			roomRef.get('users').get(prevUserId).set(null);
		}
		prevUserId = currentUserId;
		userRef.set({
			id: currentUserId,
			username: $currentUser.username,
			ready: true
		});
	}

	$: getResults = (user: IUser) =>
		questionResults.map((result) => (results[user.id] || {})[result.questionId]);

	$: percent =
		questionResults.reduce((count, questionResult) => count + questionResult.result, 0) /
		questionResults.length;

	onMount(() => {
		const removeListenerCallbacks = [
			roomRef.get('users').on(async (state) => {
				users = (await Promise.all(Object.values(state))).reduce((acc, user) => {
					acc[user.id] = user;
					return acc;
				}, {} as IUsers);
			}),
			roomRef.get('results').on(async (state) => {
				results = (
					await Promise.all(
						Object.entries(state).map(async ([userId, results]) => [userId, await results])
					)
				).reduce((acc, [userId, results]) => {
					acc[userId as string] = results as IQuestionResults;
					return acc;
				}, {} as IResults);
			})
		];

		return () => {
			removeListenerCallbacks.forEach((removeListener) => removeListener());
		};
	});
</script>

<div class="container">
	<h2>{quiz.name}</h2>
	{#each quiz.tags as tag}
		<span class="badge bg-primary me-2">{tag}</span>
	{/each}
	<hr />
	<div>
		{#each userList as [_userId, user]}
			<div class="d-flex flex-row justify-content-between">
				<div>{user.username}</div>
				<QuizState results={getResults(user)} />
			</div>
		{/each}
	</div>
	<hr />
	{#if questionResults.length === 0}
		<p>You have not taken this quiz yet.</p>
		<div class="d-flex justify-content-end mt-2">
			<a role="button" class="btn btn-primary" href={`/quizzes/${quiz.id}`}>Take</a>
		</div>
	{:else}
		<h3>Percent {toPercent(percent)}</h3>
		<ul class="list-group list-group-flush">
			{#each questionResults as questionResult}
				<li class="list-group-item">
					{#if questionResult.type === 'multiple_choice'}
						<MultipleChoiceReview result={questionResult} />
					{:else if questionResult.type === 'flash_card'}
						<FlashCardReview result={questionResult} />
					{:else if questionResult.type === 'input'}
						<InputReview result={questionResult} />
					{/if}
				</li>
			{/each}
		</ul>
		<div class="d-flex justify-content-end mt-2">
			<a role="button" class="btn btn-primary" href={`/quizzes/${quiz.id}`}>Retake</a>
		</div>
	{/if}
</div>
