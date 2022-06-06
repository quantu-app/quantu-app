<svelte:options immutable />

<script lang="ts">
	import DeleteChallenge from './DeleteChallenge.svelte';
	import ChallengeListItem from './ChallengeListItem.svelte';
	import UpdateChallenge from './UpdateChallenge.svelte';
	import type { StateChallenge } from '$lib/state/creator/challenges';
	import { deleteChallenge, updateChallenge } from '$lib/state/creator/challenges';
	import { addNotification, NotificationType } from '$lib/state/notifications';

	export let departmentId: string = undefined;
	export let challenges: Array<StateChallenge>;

	let updateOpen = false;
	let challengeToUpdate: StateChallenge | undefined;
	let deleteOpen = false;
	let challengeToDelete: StateChallenge | undefined;

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
			try {
				await updateChallenge(departmentId, challengeToUpdate.id, challengeBody);
				challengeToUpdate = undefined;
				updateOpen = false;
			} catch (e) {
				console.error(e);
				addNotification({
					type: NotificationType.Danger,
					title: 'Error Updating',
					description: (e as Error).message
				});
			}
		}
	}
	async function onDeleteChallenge() {
		if (challengeToDelete) {
			try {
				await deleteChallenge(departmentId, challengeToDelete.id);
				challengeToDelete = undefined;
				deleteOpen = false;
			} catch (e) {
				console.error(e);
				addNotification({
					type: NotificationType.Danger,
					title: 'Error Upoading',
					description: (e as Error).message
				});
			}
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
