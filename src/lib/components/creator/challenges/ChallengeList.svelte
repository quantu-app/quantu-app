<script lang="ts">
	import DeleteChallenge from './DeleteChallenge.svelte';
	import ChallengeListItem from './ChallengeListItem.svelte';
	import UpdateChallenge from './UpdateChallenge.svelte';
	import type { Challenge, Topic } from '@prisma/client';
	import { deleteChallenge, updateChallenge } from '$lib/state/creator/challenges';

	export let path: string;
	export let topicId: string = undefined;
	export let challenges: Array<Challenge & { topic: Topic }>;

	let challenge: Challenge;
	let challengeIndex: number;

	function createOnUpdate(q: Challenge, index: number) {
		return function onUpdate() {
			challenge = q;
			challengeIndex = index;
		};
	}
	function createOnDelete(q: Challenge, index: number) {
		return function onDelete() {
			challenge = q;
			challengeIndex = index;
		};
	}

	async function onUpdateChallenge() {
		if (challenge) {
			await updateChallenge(challenge.id, challenge);
			challenge = undefined;
			challengeIndex = undefined;
		}
	}
	async function onDeleteChallenge() {
		if (challenge) {
			deleteChallenge(challenge.id);
			challenge = undefined;
			challengeIndex = undefined;
		}
	}
</script>

<div class="list-group list-group-flush">
	{#each challenges as challenge, index (challenge.id)}
		<ChallengeListItem
			{challenge}
			{path}
			{topicId}
			onUpdate={createOnUpdate(challenge, index)}
			onDelete={createOnDelete(challenge, index)}
		>
			<slot
				slot="dropdown"
				name="dropdown"
				{challenge}
				onUpdate={createOnUpdate(challenge, index)}
				onDelete={createOnDelete(challenge, index)}
			>
				<li>
					<button
						type="button"
						class="dropdown-item justify-content-between"
						data-bs-toggle="modal"
						data-bs-target="#update-challenge"
						aria-label="Update"
						on:click={createOnUpdate(challenge, index)}>Update</button
					>
				</li>
				<li>
					<button
						type="button"
						class="dropdown-item justify-content-between"
						data-bs-toggle="modal"
						data-bs-target="#delete-challenge"
						aria-label="Delete"
						on:click={createOnDelete(challenge, index)}>Delete</button
					>
				</li>
			</slot>
		</ChallengeListItem>
	{/each}
</div>

<UpdateChallenge {challenge} {onUpdateChallenge} />
<DeleteChallenge {challenge} {onDeleteChallenge} />
