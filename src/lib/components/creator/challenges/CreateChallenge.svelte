<svelte:options immutable />

<script lang="ts">
	import { createChallenge } from '$lib/state/creator/challenges';
	import type { StateChallenge } from '$lib/state/creator/challenges';
	import ChallengeEditor from './ChallengeEditor.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { addNotification, NotificationType } from '$lib/state/notifications';

	export let departmentId: string | undefined = undefined;

	let editorKey = Math.random();
	let creatingChallenge = false;

	let challenge: Partial<StateChallenge> = { departmentId, type: 'MULTIPLE_CHOICE', prompt: {} };

	async function onCreateChallenge() {
		if (!departmentId) {
			return;
		}
		creatingChallenge = true;
		try {
			await createChallenge(departmentId, challenge);
			open = false;
			challenge = { departmentId, type: 'MULTIPLE_CHOICE', prompt: {} };
		} catch (e) {
			console.error(e);
			addNotification({
				type: NotificationType.Danger,
				title: 'Error Upoading',
				description: (e as Error).message
			});
		} finally {
			creatingChallenge = false;
			editorKey = Math.random();
		}
	}

	let open = false;
	function onOpen() {
		open = true;
	}
</script>

<button type="button" class="btn btn-primary" on:click={onOpen} aria-label="Create Challenge"
	>Create Challenge</button
>

<Modal bind:open>
	<svelte:fragment slot="header">Create Challenge</svelte:fragment>
	{#key editorKey}
		<ChallengeEditor bind:challenge />
	{/key}
	<button
		slot="footer"
		type="button"
		on:click={onCreateChallenge}
		disabled={creatingChallenge}
		class="btn btn-primary"
	>
		{#if creatingChallenge}
			<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
		{/if}
		Create
	</button>
</Modal>
