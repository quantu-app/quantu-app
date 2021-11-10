<script lang="ts">
	import type { Quiz, Question, QuestionResult } from '$lib/api/quantu-app-api';
	import QuestionComponent from '$lib/Questions/Question.svelte';
	import {
		playGraph,
		IUser,
		IUsers,
		IResults,
		IQuestionResults,
		QuestionState
	} from '$lib/state/play';
	import { currentUser } from '$lib/state/user';
	import { onMount } from 'svelte';
	import QuizState from './QuizState.svelte';

	export let playId: string;
	export let quiz: Quiz;
	export let question: Question;
	export let questionCount: number;
	export let questionList: Question[];
	export let seed: number;
	export let index: number;

	$: currentUserId = $currentUser?.id;
	$: roomRef = playGraph.get('rooms').get(playId);
	$: userRef = roomRef.get('users').get(currentUserId);
	let users: IUsers = {};
	$: userList = Array.from(Object.entries(users)) as [id: string, user: IUser][];
	$: userResultsRef = roomRef.get('results').get(currentUserId);
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
		userResultsRef.get(question.id.toString()).set(QuestionState.Current);
	}

	let result: QuestionResult = undefined;
	$: if (result !== undefined && result.questionId) {
		userResultsRef
			.get(result.questionId.toString())
			.set(result.result >= 0.5 ? QuestionState.Correct : QuestionState.Incorrect);
	}

	$: getResults = (user: IUser) =>
		questionList.map((question) => (results[user.id] || {})[question.id]);

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

<div class="container mb-2 h-100">
	<h2>
		{quiz.name}
	</h2>
	<hr class="mb-0" />
	<div>
		{#each userList as [_userId, user]}
			<div class="d-flex flex-row justify-content-between">
				<div>{user.username}</div>
				<QuizState results={getResults(user)} />
			</div>
		{/each}
	</div>
	<hr class="my-0" />
	<QuestionComponent {question} {seed} bind:result>
		<a
			slot="extra"
			role="button"
			class="btn btn-primary"
			href={index >= questionCount - 1
				? `/quizzes/${quiz.id}/play/${playId}/review?seed=${seed}&questionCount=${questionCount}`
				: `/quizzes/${quiz.id}/play/${playId}/answer?index=${
						index + 1
				  }&seed=${seed}&questionCount=${questionCount}`}
		>
			{#if index >= questionCount - 1}
				Finish
			{:else}
				Next
			{/if}
		</a>
	</QuestionComponent>
</div>
