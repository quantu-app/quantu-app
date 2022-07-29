<svelte:options immutable />

<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { createChange } from '$lib/state/creator/changes';
	import { addNotification, NotificationType } from '$lib/state/notifications';
	import type { Chapter } from '@prisma/client';

	export let chapter: Chapter;
	export let open = false;

	let name: string;
	let creatingChapterChange = false;

	async function onCreateChapterChange() {
		creatingChapterChange = true;
		try {
			const change = await createChange('DEPARTMENT', chapter.id, name, {});
			open = false;
			await goto(`${base}/creator/chapters/changes/${change.id}`);
		} catch (e) {
			console.error(e);
			addNotification({
				type: NotificationType.Danger,
				title: 'Error Creating Change',
				description: (e as Error).message
			});
		} finally {
			creatingChapterChange = false;
		}
	}
</script>

<Modal bind:open>
	<svelte:fragment slot="header">Propose a Change to {chapter.name}</svelte:fragment>
	<div class="row mb-2">
		<div class="col">
			<label for="name" class="form-label">Name of this Change</label>
			<input
				id="name"
				type="text"
				class="form-control"
				placeholder="Change Name"
				bind:value={name}
			/>
		</div>
	</div>
	<button
		slot="footer"
		type="button"
		on:click={onCreateChapterChange}
		disabled={creatingChapterChange}
		class="btn btn-primary"
	>
		{#if creatingChapterChange}
			<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
		{/if}
		Create
	</button>
</Modal>
