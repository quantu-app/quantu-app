<svelte:options immutable />

<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { createCourse } from '$lib/state/creator/courses';
	import type { StateDepartment } from '$lib/state/creator/departments';
	import { addNotification, NotificationType } from '$lib/state/notifications';
	import type { Course } from '@prisma/client';
	import CourseEditor from './CourseEditor.svelte';

	export let department: StateDepartment;

	let open = false;
	function onOpen() {
		open = true;
	}
	let course: Partial<Course> = {};

	let creatingCourseChange = false;
	async function onCreateCourse() {
		creatingCourseChange = true;
		try {
			const { id } = await createCourse(department.id, course);
			open = false;
			await goto(`${base}/creator/departments/${department.id}/courses/${id}`);
			course = {};
		} catch (e) {
			console.error(e);
			addNotification({
				type: NotificationType.Danger,
				title: 'Error Creating',
				description: (e as Error).message
			});
		} finally {
			creatingCourseChange = false;
		}
	}
</script>

<button type="button" class="btn btn-primary" on:click={onOpen} aria-label="Create Course"
	>Create a new Course</button
>

<Modal bind:open>
	<svelte:fragment slot="header">Create a new Course</svelte:fragment>
	<CourseEditor {department} bind:course />
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
