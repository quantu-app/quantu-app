<svelte:options immutable />

<script lang="ts">
	import { addNotification, NotificationType } from '$lib/state/notifications';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { deleteLesson, type StateLesson } from '$lib/state/creator/lessons';

	export let lesson: StateLesson;
	export let open = false;

	let deletingLesson = false;
	async function onCreateLesson() {
		deletingLesson = true;
		try {
			open = false;
			await deleteLesson(lesson.id);
		} catch (e) {
			console.error(e);
			addNotification({
				type: NotificationType.Danger,
				description: (e as Error).message
			});
		} finally {
			deletingLesson = false;
		}
	}
</script>

<Modal bind:open>
	<svelte:fragment slot="header">Delete Lesson {lesson.name}?</svelte:fragment>
	<p>This will delete all lesson blocks? are you sure?</p>
	<button slot="footer" class="btn btn-danger" on:click={onCreateLesson} disabled={deletingLesson}
		>Delete</button
	>
</Modal>
