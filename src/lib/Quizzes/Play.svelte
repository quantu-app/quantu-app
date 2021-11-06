<script lang="ts">
	import type { Quiz } from '$lib/api/quantu-app-api';
	import { Ref } from '@aicacia/graph';
	import { currentUser } from '$lib/state/user';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { graph, IUser, IUsers } from '$lib/state/play';
	import { browser } from '$app/env';

	export let quiz: Quiz;
	export let playId: string;
	export let seed: number;
	export let questionCount: number;

	$: currentUserId = $currentUser?.id;
	$: roomRef = graph.get('rooms').get(playId);
	$: userRef = roomRef.get('users').get(currentUserId);
	let users: IUsers = {};
	$: userList = Array.from(Object.entries(users)) as [id: string, user: IUser][];
	$: ready = userList.every(([_id, user]) => !!user.ready);
	$: user = users[currentUserId];
	let started = false;

	$: if (browser && started) {
		goto(
			`/quizzes/${quiz.id}/play/${playId}/answer?index=0&seed=${seed}&questionCount=${questionCount}`
		);
	}

	let prevUserId: string;
	$: if (prevUserId !== currentUserId && currentUserId) {
		if (prevUserId) {
			roomRef.get('users').get(prevUserId).set(null);
		}
		prevUserId = currentUserId;
		userRef.set({
			id: currentUserId,
			username: $currentUser.username,
			ready: false
		});
	}

	$: onStart = () => {
		roomRef.get('started').set(true);
	};
	$: onReady = () => {
		userRef.get('ready').set(!user?.ready);
	};

	onMount(() => {
		const removeListenerCallbacks = [
			roomRef.get('started').on((state) => {
				started = state as boolean;
			}),
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

<div class="container mb-2">
	<h2>{quiz.name}</h2>
	{#each quiz.tags as tag}
		<span class="badge bg-primary me-2">{tag}</span>
	{/each}
	<hr />
</div>
<div class="container mb-2">
	<div class="col-lg-4 col-md-6 mx-auto">
		<div class="row">
			<div class="col-md">
				<h3>Players</h3>
				<ul class="list-group list-group-flush">
					{#each userList as [_userId, user]}
						<li class="list-group-item">
							<div class="d-flex justify-content-between">
								{user.username}
								<span class="badge bg-primary">
									{user.ready ? 'Ready' : 'Not Ready'}
								</span>
							</div>
						</li>
					{/each}
				</ul>
			</div>
		</div>
		<div class="d-flex justify-content-between mt-2">
			<button
				role="button"
				class="btn"
				class:btn-primary={!user?.ready}
				class:btn-danger={user?.ready}
				on:click={onReady}>{user?.ready ? 'Not Ready' : 'Ready'}</button
			>
			{#if ready && userList.length > 1}
				<button role="button" class="btn btn-primary" disabled on:click={onStart}
					>Work in Progress</button
				>
			{/if}
		</div>
	</div>
</div>
