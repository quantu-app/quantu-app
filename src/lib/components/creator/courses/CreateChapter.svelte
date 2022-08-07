<svelte:options immutable />

<script lang="ts">
	import type { StateCourse } from '$lib/state/creator/courses';
	import type { StateDepartment } from '$lib/state/creator/departments';
	import { createChapter, validChapterUrl } from '$lib/state/creator/chapters';
	import { addNotification, NotificationType } from '$lib/state/notifications';
	import { debounce } from '@aicacia/debounce';
	import Modal from '$lib/components/ui/Modal.svelte';

	export let department: StateDepartment;
	export let course: StateCourse;
	export let open = false;

	let chapterName: '';
	let chapterUrl: '';
	let validUrl = true;
	let validatingUrl = false;
	async function onUrlChange() {
		if (validatingUrl) {
			return;
		}
		validatingUrl = true;
		try {
			validUrl = await validChapterUrl(department.url, course.url, chapterUrl);
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

	let creatingChapter = false;
	async function onCreateChapter() {
		creatingChapter = true;
		try {
			const promise = createChapter(course.id, {
				name: chapterName,
				url: chapterUrl,
				description: []
			});
			chapterName = '';
			chapterUrl = '';
			open = false;
			await promise;
		} catch (e) {
			console.error(e);
			addNotification({
				type: NotificationType.Danger,
				description: (e as Error).message
			});
		} finally {
			creatingChapter = false;
		}
	}
</script>

<Modal bind:open>
	<svelte:fragment slot="header">Create Chapter in {course.name}</svelte:fragment>
	<div class="row">
		<div class="col-md">
			<label for="chapter-url" class="form-label">Chapter Name</label>
			<input
				class="form-control"
				name="chapter-url"
				type="text"
				placeholder="Chapter Name"
				bind:value={chapterName}
			/>
		</div>
		<div class="col-md">
			<label for="chapter-name" class="form-label">URL</label>
			<input
				name="chapter-name"
				class="form-control"
				type="text"
				placeholder="Chapter URL"
				class:is-invalid={!validUrl}
				bind:value={chapterUrl}
				on:change={debouncedOnUrlChange}
			/>
		</div>
	</div>
	<button
		slot="footer"
		class="btn btn-primary"
		on:click={onCreateChapter}
		disabled={creatingChapter || !validUrl || validatingUrl}>Create</button
	>
</Modal>
