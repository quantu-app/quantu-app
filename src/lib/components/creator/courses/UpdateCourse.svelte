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
	export let course: Course;
	export let open = false;

	let name: string;
	let creatingCourse = false;

	async function onCreateCourse() {
		creatingCourse = true;
		try {
			const course = await createCourse(department.id, {});
			open = false;
			await goto(`${base}/creator/departments/${department.id}/courses/${course.id}`);
		} catch (e) {
			console.error(e);
			addNotification({
				type: NotificationType.Danger,
				title: 'Error Creating Change',
				description: (e as Error).message
			});
		} finally {
			creatingCourse = false;
		}
	}
</script>

<Modal bind:open>
	<svelte:fragment slot="header">Propose a Change to {course.name}</svelte:fragment>
	<CourseEditor {department} bind:course />
	<button
		slot="footer"
		type="button"
		on:click={onCreateCourse}
		disabled={creatingCourse}
		class="btn btn-primary"
	>
		{#if creatingCourse}
			<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
		{/if}
		Create
	</button>
</Modal>
