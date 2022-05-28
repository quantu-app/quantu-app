<svelte:options immutable />

<script lang="ts">
	import Modal from '$lib/components/ui/Modal.svelte';
	import type { StateChallenge } from '$lib/state/creator/challenges';
	import ChallengeEditor from './ChallengeEditor.svelte';

	export let open = false;
	export let challenge: StateChallenge | undefined;
	export let onUpdateChallenge: () => Promise<void>;

	async function internalUpdateChallenge() {
		await onUpdateChallenge();
	}
</script>

<Modal bind:open>
	<svelte:fragment slot="header">Update Challenge</svelte:fragment>
	{#if challenge}
		{#key challenge.id}
			<ChallengeEditor bind:challenge />
		{/key}
	{/if}
	<button slot="footer" type="button" on:click={internalUpdateChallenge} class="btn btn-primary"
		>Update</button
	>
</Modal>
