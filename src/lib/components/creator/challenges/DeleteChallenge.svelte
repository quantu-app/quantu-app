<svelte:options immutable />

<script lang="ts">
	import Modal from '$lib/components/ui/Modal.svelte';
	import type { StateChallenge } from '$lib/state/creator/challenges';
	import { titleCase } from 'title-case';

	export let open = false;
	export let challenge: StateChallenge;
	export let onDeleteChallenge: () => Promise<void>;

	let deletingChallenge = false;

	async function internalOnDeleteChallenge() {
		deletingChallenge = true;
		try {
			await onDeleteChallenge();
		} finally {
			deletingChallenge = false;
		}
		open = false;
	}
</script>

<Modal bind:open>
	<svelte:fragment slot="header">
		Delete {challenge?.name} - {challenge ? titleCase(challenge.type.replace('_', ' ')) : ''}
		{challenge?.id}
	</svelte:fragment>
	<button
		type="button"
		slot="footer"
		on:click={internalOnDeleteChallenge}
		class="btn btn-danger text-white"
		disabled={deletingChallenge}
	>
		{#if deletingChallenge}
			<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
		{/if}
		Delete</button
	>
</Modal>
