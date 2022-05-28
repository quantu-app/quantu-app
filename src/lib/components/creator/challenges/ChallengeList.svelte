<svelte:options immutable />

<script lang="ts">
	import DeleteChallenge from './DeleteChallenge.svelte';
	import ChallengeListItem from './ChallengeListItem.svelte';
	import UpdateChallenge from './UpdateChallenge.svelte';
	import type { StateChallenge } from '$lib/state/creator/challenges';
	import { deleteChallenge, updateChallenge } from '$lib/state/creator/challenges';

	export let departmentId: string = undefined;
	export let challenges: Array<StateChallenge>;

	let updateOpen = false;
	let challengeToUpdate: StateChallenge;
	let deleteOpen = false;
	let challengeToDelete: StateChallenge;

	function createOnUpdate(q: StateChallenge) {
		return function onUpdate() {
			updateOpen = true;
			challengeToUpdate = q;
		};
	}
	function createOnDelete(q: StateChallenge) {
		return function onDelete() {
			deleteOpen = true;
			challengeToDelete = q;
		};
	}

	async function onUpdateChallenge() {
		if (challengeToUpdate) {
			const { id, department, ...challengeBody } = challengeToUpdate;

			await updateChallenge(departmentId, challengeToUpdate.id, challengeBody);
			challengeToUpdate = undefined;
			updateOpen = false;
		}
	}
	async function onDeleteChallenge() {
		if (challengeToDelete) {
			await deleteChallenge(departmentId, challengeToDelete.id);
			challengeToDelete = undefined;
			deleteOpen = false;
		}
	}
</script>

<div class="list-group list-group-flush">
	{#each challenges as challenge (challenge.id)}
		<ChallengeListItem
			{challenge}
			onUpdate={createOnUpdate(challenge)}
			onDelete={createOnDelete(challenge)}
		/>
	{/each}
</div>

<UpdateChallenge bind:open={updateOpen} challenge={challengeToUpdate} {onUpdateChallenge} />
<DeleteChallenge bind:open={deleteOpen} challenge={challengeToDelete} {onDeleteChallenge} />
