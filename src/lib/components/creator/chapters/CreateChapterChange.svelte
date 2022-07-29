<svelte:options immutable />

<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { createChange } from '$lib/state/creator/changes';
	import type { StateDepartment } from '$lib/state/creator/departments';
	import { addNotification, NotificationType } from '$lib/state/notifications';
	import type { Chapter } from '@prisma/client';
	import ChapterChangeEditor from './ChapterChangeEditor.svelte';

	export let department: StateDepartment;

	let editorKey = Math.random();
	let open = false;
	function onOpen() {
		open = true;
	}
	let name: string;
	let chapterChange: Partial<Chapter> = {};

	let creatingChapterChange = false;
	async function onCreateChapter() {
		creatingChapterChange = true;
		try {
			const { id } = await createChange('DEPARTMENT', null, name, chapterChange as any);
			open = false;
			await goto(`${base}/creator/chapters/changes/${id}`);
			chapterChange = {};
		} catch (e) {
			console.error(e);
			addNotification({
				type: NotificationType.Danger,
				title: 'Error Creating',
				description: (e as Error).message
			});
		} finally {
			creatingChapterChange = false;
			editorKey = Math.random();
		}
	}
</script>

<button type="button" class="btn btn-primary" on:click={onOpen} aria-label="Create Chapter"
	>Create a new Chapter</button
>

<Modal bind:open>
	<svelte:fragment slot="header">Create a new Chapter</svelte:fragment>
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
	{#key editorKey}
		<ChapterChangeEditor bind:chapterChange />
	{/key}
	<button
		slot="footer"
		type="button"
		on:click={onCreateChapter}
		disabled={creatingChapterChange}
		class="btn btn-primary"
	>
		{#if creatingChapterChange}
			<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
		{/if}
		Create
	</button>
</Modal>
