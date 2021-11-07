<script lang="ts">
	import type { Quiz, Question, QuestionResult } from '$lib/api/quantu-app-api';
	import QuestionComponent from '$lib/Questions/Question.svelte';
	import { playGraph, IUser, IUsers } from '$lib/state/play';
	import { currentUser } from '$lib/state/user';
	import { Ref } from '@aicacia/graph';
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

	let result: QuestionResult = undefined;
	$: if (result !== undefined && result.questionId) {
		userRef
			.get('results')
			.get(result.questionId.toString())
			.set(result.result >= 0.5);
	}

	$: getResults = (user: IUser) =>
		questionList.map((question) => (user?.results ? user.results[question.id] : undefined));

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
