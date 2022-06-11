<svelte:options immutable />

<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { createChange } from '$lib/state/creator/changes';
	import { addNotification, NotificationType } from '$lib/state/notifications';
	import type { Department } from '@prisma/client';

	export let department: Department;
	export let open = false;

	let name: string;
	let creatingDepartmentChange = false;

	async function onCreateDepartmentChange() {
		creatingDepartmentChange = true;
		try {
			const change = await createChange('DEPARTMENT', department.id, name, {});
			open = false;
			await goto(`${base}/creator/departments/changes/${change.id}`);
		} catch (e) {
			console.error(e);
			addNotification({
				type: NotificationType.Danger,
				title: 'Error Creating Change',
				description: (e as Error).message
			});
		} finally {
			creatingDepartmentChange = false;
		}
	}
</script>

<Modal bind:open>
	<svelte:fragment slot="header">Propose a Change to {department.name}</svelte:fragment>
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
		on:click={onCreateDepartmentChange}
		disabled={creatingDepartmentChange}
		class="btn btn-primary"
	>
		{#if creatingDepartmentChange}
			<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
		{/if}
		Create
	</button>
</Modal>
