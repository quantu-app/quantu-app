<svelte:options immutable />

<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { createChange } from '$lib/state/creator/changes';
	import type { StateDepartment } from '$lib/state/creator/departments';
	import { addNotification, NotificationType } from '$lib/state/notifications';
	import type { Course } from '@prisma/client';
	import CourseChangeEditor from './CourseChangeEditor.svelte';

	export let department: StateDepartment;

	let editorKey = Math.random();
	let open = false;
	function onOpen() {
		open = true;
	}
	let name: string;
	let courseChange: Partial<Course> = {};

	let creatingCourseChange = false;
	async function onCreateCourse() {
		creatingCourseChange = true;
		try {
			const { id } = await createChange('COURSE', null, name, {
				...courseChange,
				departmentId: department.id
			});
			open = false;
			await goto(`${base}/creator/courses/changes/${id}`);
			courseChange = {};
		} catch (e) {
			console.error(e);
			addNotification({
				type: NotificationType.Danger,
				title: 'Error Creating',
				description: (e as Error).message
			});
		} finally {
			creatingCourseChange = false;
			editorKey = Math.random();
		}
	}
</script>

<button type="button" class="btn btn-primary" on:click={onOpen} aria-label="Create Course"
	>Create a new Course</button
>

<Modal bind:open>
	<svelte:fragment slot="header">Create a new Course</svelte:fragment>
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
		<CourseChangeEditor bind:courseChange />
	{/key}
	<button
		slot="footer"
		type="button"
		on:click={onCreateCourse}
		disabled={creatingCourseChange}
		class="btn btn-primary"
	>
		{#if creatingCourseChange}
			<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
		{/if}
		Create
	</button>
</Modal>
