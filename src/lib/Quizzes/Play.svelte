<script lang="ts" context="module">
	function onShare() {
		if (navigator && navigator.share) {
			navigator
				.share({
					title: document.title,
					text: 'Join my Game!',
					url: location.href
				})
				.then(() =>
					addNotification({ description: 'Successful shared!', type: NotificationType.Success })
				)
				.catch((err) =>
					addNotification({ description: err.message, type: NotificationType.Danger })
				);
		} else if (navigator && navigator.clipboard) {
			navigator.clipboard
				.writeText(location.href)
				.then(() =>
					addNotification({ description: 'Successful Copied!', type: NotificationType.Success })
				);
		} else if ('execCommand' in document) {
			const element = document.createElement('input');
			element.style.display = 'none';
			element.textContent = location.href;
			document.body.appendChild(element);
			element.select();
			document.execCommand('copy');
			document.body.removeChild(element);
		}
	}
</script>

<script lang="ts">
	import type { Quiz } from '$lib/api/quantu-app-api';
	import { Ref } from '@aicacia/graph';
	import { currentUser } from '$lib/state/user';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { playGraph, IUser, IUsers } from '$lib/state/play';
	import { browser } from '$app/env';
	import { addNotification, NotificationType } from '$lib/state/notifications';

	export let quiz: Quiz;
	export let playId: string;
	export let seed: number;
	export let questionCount: number;

	$: currentUserId = $currentUser?.id;
	$: roomRef = playGraph.get('rooms').get(playId);
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
			ready: false,
			results: {}
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
	<div class="d-flex flex-row justify-content-between">
		<div>
			<h2>
				{quiz.name} -
				<h5 class="d-inline">Question(s) {questionCount}</h5>
			</h2>
		</div>
		<div>
			<button class="btn btn-primary" on:click={onShare}>Share</button>
		</div>
	</div>
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
								<span class="badge" class:bg-success={user.ready} class:bg-danger={!user.ready}>
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
				<button role="button" class="btn btn-primary" on:click={onStart}>Start</button>
			{/if}
		</div>
	</div>
</div>
