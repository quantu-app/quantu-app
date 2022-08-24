<svelte:options immutable />

<script lang="ts">
	import { deleteChapter, type StateChapter } from '$lib/state/creator/chapters';
	import { addNotification, NotificationType } from '$lib/state/notifications';
	import Modal from '$lib/components/ui/Modal.svelte';

	export let chapter: StateChapter;
	export let open = false;

	let deletingChapter = false;
	async function onDeleteChapter() {
		deletingChapter = true;
		try {
			open = false;
			await deleteChapter(chapter.id);
		} catch (e) {
			console.error(e);
			addNotification({
				type: NotificationType.Danger,
				description: (e as Error).message
			});
		} finally {
			deletingChapter = false;
		}
	}
</script>

<Modal bind:open>
	<svelte:fragment slot="header">Delete Chapter {chapter.name}?</svelte:fragment>
	<p>This will delete all lessons and everything inside of them? are you sure?</p>
	<button slot="footer" class="btn btn-danger" on:click={onDeleteChapter} disabled={deletingChapter}
		>Delete</button
	>
</Modal>
