<svelte:options immutable />

<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { createChange } from '$lib/state/creator/changes';
	import type { StateDepartment } from '$lib/state/creator/departments';
	import { addNotification, NotificationType } from '$lib/state/notifications';
	import type { Course } from '@prisma/client';

	export let department: StateDepartment;
	export let course: Course;
	export let open = false;

	let name: string;
	let creatingCourseChange = false;

	async function onCreateCourseChange() {
		creatingCourseChange = true;
		try {
			const change = await createChange('DEPARTMENT', course.id, name, {});
			open = false;
			await goto(`${base}/creator/departments/${department.id}/courses/changes/${change.id}`);
		} catch (e) {
			console.error(e);
			addNotification({
				type: NotificationType.Danger,
				title: 'Error Creating Change',
				description: (e as Error).message
			});
		} finally {
			creatingCourseChange = false;
		}
	}
</script>

<Modal bind:open>
	<svelte:fragment slot="header">Propose a Change to {course.name}</svelte:fragment>
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
		on:click={onCreateCourseChange}
		disabled={creatingCourseChange}
		class="btn btn-primary"
	>
		{#if creatingCourseChange}
			<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
		{/if}
		Create
	</button>
</Modal>
