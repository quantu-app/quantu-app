<svelte:options immutable />

<script lang="ts">
	import Modal from '$lib/components/ui/Modal.svelte';
	import { addNotification, NotificationType } from '$lib/state/notifications';

	export let open: boolean;
	export let onDelete: () => Promise<void>;

	let deleting = false;
	async function internalOnDelete() {
		deleting = true;
		try {
			await onDelete();
		} catch (e) {
			console.error(e);
			addNotification({
				type: NotificationType.Danger,
				title: 'Error Deleting Solution',
				description: (e as Error).message
			});
		} finally {
			deleting = false;
		}
	}
</script>

<Modal bind:open>
	<svelte:fragment slot="header">Delete your Solution to this Challenge</svelte:fragment>
	<p>This will delete all comments as well from your solution.</p>
	<button
		slot="footer"
		type="button"
		on:click={internalOnDelete}
		class="btn btn-danger text-white"
		disabled={deleting}
	>
		{#if deleting}
			<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
		{/if}
		Delete</button
	>
</Modal>
