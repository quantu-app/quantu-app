<svelte:options immutable />

<script lang="ts">
	import { addNotification, NotificationType } from '$lib/state/notifications';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { deleteLessonBlock, type StateLessonBlock } from '$lib/state/creator/lessonBlocks';

	export let lessonBlock: StateLessonBlock;
	export let open = false;

	let deletingLessonBlock = false;
	async function onDeleteLessonBlock() {
		deletingLessonBlock = true;
		try {
			open = false;
			await deleteLessonBlock(lessonBlock.id);
		} catch (e) {
			console.error(e);
			addNotification({
				type: NotificationType.Danger,
				description: (e as Error).message
			});
		} finally {
			deletingLessonBlock = false;
		}
	}
</script>

<Modal bind:open>
	<svelte:fragment slot="header">Delete LessonBlock {lessonBlock.type}?</svelte:fragment>
	<p>This will delete the lesson block? are you sure?</p>
	<button
		slot="footer"
		class="btn btn-danger"
		on:click={onDeleteLessonBlock}
		disabled={deletingLessonBlock}>Delete</button
	>
</Modal>
