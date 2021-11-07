<script lang="ts">
	import type { QuestionResult } from '$lib/api/quantu-app-api';
	import type { Quiz } from '$lib/api/quantu-app-api';
	import FlashCardReview from '$lib/Questions/FlashCardReview.svelte';
	import InputReview from '$lib/Questions/InputReview.svelte';
	import MultipleChoiceReview from '$lib/Questions/MultipleChoiceReview.svelte';
	import { IUser, IUsers, playGraph } from '$lib/state/play';
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

	let prevUserId: string;
	$: if (prevUserId !== currentUserId && currentUserId) {
		if (prevUserId) {
			roomRef.get('users').get(prevUserId).set(null);
		}
		prevUserId = currentUserId;
		userRef.set({
			id: currentUserId,
			username: $currentUser.username,
			ready: true,
			results: {}
		});
	}

	$: getResults = (user: IUser) =>
		questionResults.map((result) => (user?.results ? user.results[result.questionId] : undefined));

	$: percent =
		questionResults.reduce((count, questionResult) => count + questionResult.result, 0) /
		questionResults.length;

	onMount(() => {
		const removeListenerCallbacks = [
			roomRef.get('users').on(async (state) => {
				users = (
					await Promise.all(
						Object.values(state).map((user) => {
							if (user instanceof Ref) {
								return user.then<IUser>();
							} else {
								return user as unknown as IUser;
							}
						})
					)
				).reduce((acc, user) => {
					acc[user.id] = user;
					return acc;
				}, {} as IUsers);
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
