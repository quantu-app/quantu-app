<svelte:options immutable />

<script lang="ts">
	import DeleteChallenge from './DeleteChallenge.svelte';
	import ChallengeListItem from './ChallengeListItem.svelte';
	import UpdateChallenge from './UpdateChallenge.svelte';
	import type { StateChallenge } from '$lib/state/creator/challenges';
	import { deleteChallenge, updateChallenge } from '$lib/state/creator/challenges';

	export let departmentId: string = undefined;
	export let challenges: Array<StateChallenge>;

	let challengeToUpdate: StateChallenge;
	let challengeToDelete: StateChallenge;

	function createOnUpdate(q: StateChallenge) {
		return function onUpdate() {
			challengeToUpdate = q;
		};
	}
	function createOnDelete(q: StateChallenge) {
		return function onDelete() {
			challengeToDelete = q;
		};
	}

	async function onUpdateChallenge() {
		if (challengeToUpdate) {
			const { id, department, ...challengeBody } = challengeToUpdate;

			await updateChallenge(departmentId, challengeToUpdate.id, challengeBody);
			challengeToUpdate = undefined;
		}
	}
	async function onDeleteChallenge() {
		if (challengeToDelete) {
			await deleteChallenge(departmentId, challengeToDelete.id);
			challengeToDelete = undefined;
		}
	}
</script>

<div class="list-group list-group-flush">
	{#each challenges as challenge (challenge.id)}
		<ChallengeListItem
			{challenge}
			onUpdate={createOnUpdate(challenge)}
			onDelete={createOnDelete(challenge)}
		>
			<slot
				slot="dropdown"
				name="dropdown"
				{challenge}
				onUpdate={createOnUpdate(challenge)}
				onDelete={createOnDelete(challenge)}
			>
				<li>
					<button
						type="button"
						class="dropdown-item justify-content-between"
						data-bs-toggle="modal"
						data-bs-target="#update-challenge"
						aria-label="Update"
						on:click={createOnUpdate(challenge)}>Update</button
					>
				</li>
				<li>
					<button
						type="button"
						class="dropdown-item justify-content-between"
						data-bs-toggle="modal"
						data-bs-target="#delete-challenge"
						aria-label="Delete"
						on:click={createOnDelete(challenge)}>Delete</button
					>
				</li>
			</slot>
		</ChallengeListItem>
	{/each}
</div>

<UpdateChallenge challenge={challengeToUpdate} {onUpdateChallenge} />
<DeleteChallenge challenge={challengeToDelete} {onDeleteChallenge} />
