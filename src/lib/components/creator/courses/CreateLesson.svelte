<svelte:options immutable />

<script lang="ts">
	import type { StateCourse } from '$lib/state/creator/courses';
	import type { StateDepartment } from '$lib/state/creator/departments';
	import { createLesson, validLessonUrl } from '$lib/state/creator/lessons';
	import { addNotification, NotificationType } from '$lib/state/notifications';
	import { debounce } from '@aicacia/debounce';
	import Modal from '$lib/components/ui/Modal.svelte';
	import type { StateChapter } from '$lib/state/creator/chapters';

	export let department: StateDepartment;
	export let course: StateCourse;
	export let chapter: StateChapter;
	export let open = false;

	let lessonName: '';
	let lessonUrl: '';
	let validUrl = true;
	let validatingUrl = false;
	async function onUrlChange() {
		if (validatingUrl) {
			return;
		}
		validatingUrl = true;
		try {
			validUrl = await validLessonUrl(department.url, course.url, lessonUrl);
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
	const debouncedOnUrlChange = debounce(onUrlChange, 300);

	let creatingLesson = false;
	async function onCreateLesson() {
		creatingLesson = true;
		try {
			const promise = createLesson(chapter.id, {
				name: lessonName,
				url: lessonUrl,
				description: []
			});
			lessonName = '';
			lessonUrl = '';
			open = false;
			await promise;
		} catch (e) {
			console.error(e);
			addNotification({
				type: NotificationType.Danger,
				description: (e as Error).message
			});
		} finally {
			creatingLesson = false;
		}
	}
</script>

<Modal bind:open>
	<svelte:fragment slot="header">Create Lesson in {chapter.name}</svelte:fragment>
	<div class="row">
		<div class="col-md">
			<label for="lesson-url" class="form-label">Lesson Name</label>
			<input
				class="form-control"
				name="lesson-url"
				type="text"
				placeholder="Lesson Name"
				bind:value={lessonName}
			/>
		</div>
		<div class="col-md">
			<label for="lesson-name" class="form-label">URL</label>
			<input
				name="lesson-name"
				class="form-control"
				type="text"
				placeholder="Lesson URL"
				class:is-invalid={!validUrl}
				bind:value={lessonUrl}
				on:input={debouncedOnUrlChange}
			/>
		</div>
	</div>
	<button
		slot="footer"
		class="btn btn-primary"
		on:click={onCreateLesson}
		disabled={creatingLesson || !validUrl || validatingUrl}>Create</button
	>
</Modal>
