<svelte:options immutable />

<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { createChange } from '$lib/state/creator/changes';
	import { addNotification, NotificationType } from '$lib/state/notifications';
	import type { Department } from '@prisma/client';
	import DepartmentChangeEditor from './DepartmentChangeEditor.svelte';

	let editorKey = Math.random();
	let open = false;
	function onOpen() {
		open = true;
	}
	let name: string;
	let departmentChange: Partial<Department> = {};

	let creatingDepartmentChange = false;
	async function onCreateDepartment() {
		creatingDepartmentChange = true;
		try {
			const { id } = await createChange('DEPARTMENT', undefined, name, departmentChange as any);
			open = false;
			await goto(`${base}/creator/departments/changes/${id}`);
			departmentChange = {};
		} catch (e) {
			console.error(e);
			addNotification({
				type: NotificationType.Danger,
				title: 'Error Creating',
				description: (e as Error).message
			});
		} finally {
			creatingDepartmentChange = false;
			editorKey = Math.random();
		}
	}
</script>

<button type="button" class="btn btn-primary" on:click={onOpen} aria-label="Create Department"
	>Create a new Department</button
>

<Modal bind:open>
	<svelte:fragment slot="header">Create a new Department</svelte:fragment>
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
		<DepartmentChangeEditor bind:departmentChange />
	{/key}
	<button
		slot="footer"
		type="button"
		on:click={onCreateDepartment}
		disabled={creatingDepartmentChange}
		class="btn btn-primary"
	>
		{#if creatingDepartmentChange}
			<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
		{/if}
		Create
	</button>
</Modal>
