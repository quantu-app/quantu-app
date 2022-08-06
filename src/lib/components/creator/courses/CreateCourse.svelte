<svelte:options immutable />

<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import RichEditor from '$lib/components/editor/RichEditor.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { createCourse, validCourseUrl } from '$lib/state/creator/courses';
	import type { StateDepartment } from '$lib/state/creator/departments';
	import { addNotification, NotificationType } from '$lib/state/notifications';
	import { isUrlSafe } from '$lib/utils';
	import { debounce } from '@aicacia/debounce';
	import type { Course } from '@prisma/client';
	import SelectAsset from '../assets/SelectAsset.svelte';

	export let department: StateDepartment;

	let open = false;
	function onOpen() {
		open = true;
	}
	let course: Partial<Course> = {};

	let courseUrl = course.url;
	let validUrl: boolean = false;

	$: validUrl = !!course.url && isUrlSafe(course.url);

	let validatingUrl = false;
	async function onUrl() {
		if (!validUrl || validatingUrl || courseUrl === course.url) {
			return;
		}
		validatingUrl = true;
		try {
			validUrl = await validCourseUrl(department.url, course.url as string);
		} catch (e) {
			console.error(e);
			addNotification({
				type: NotificationType.Danger,
				title: 'Error validating URL',
				description: (e as Error).message
			});
		} finally {
			validatingUrl = false;
		}
	}
	const debouncedOnUrl = debounce(onUrl, 300);

	let creatingCourse = false;
	async function onCreateCourse() {
		creatingCourse = true;
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
			creatingCourse = false;
		}
	}
</script>

<button type="button" class="btn btn-primary" on:click={onOpen} aria-label="Create Course"
	>Create a new Course</button
>

<Modal bind:open>
	<svelte:fragment slot="header">Create a new Course</svelte:fragment>
	<div class="row">
		<div class="col-md">
			<label for="course-name" class="form-label">Name</label>
			<input
				id="course-name"
				type="text"
				class="form-control"
				placeholder="Course Name"
				bind:value={course.name}
			/>
		</div>
		<div class="col-md">
			<label for="course-url" class="form-label">URL</label>
			<input
				id="course-url"
				type="text"
				class="form-control"
				placeholder="Course URL"
				class:is-invalid={!validUrl}
				bind:value={course.url}
				on:change={debouncedOnUrl}
			/>
		</div>
	</div>
	<hr />
	<div class="row">
		{#if course.id}
			<div class="col-md-3">
				<div class="form-control">
					<label for="course-logo" class="form-label">Logo</label>
					<SelectAsset
						id="course-logo"
						courseId={course.id}
						bind:assetId={course.logoId}
						type="IMAGE"
					/>
				</div>
			</div>
		{/if}
		<div class="col">
			<label for="course-description" class="form-label">Description</label>
			<RichEditor id="course-description" bind:value={course.description} />
		</div>
	</div>
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
