<script lang="ts">
	import type { Lesson } from '$lib/api/quantu-app-api';
	import { debounce } from '@aicacia/debounce';
	import { updateLesson } from '$lib/state/organizationLessons';
	import Tags from '$lib/Tags.svelte';
	import RichEditor from '$lib/RichEditor.svelte';

	export let organizationId: number;
	export let courseId: number = undefined;
	export let unitId: number = undefined;
	export let lesson: Lesson;

	function onNameChange() {
		updateLesson(organizationId, lesson.id, {
			unitId,
			name: lesson.name
		});
	}

	let updatingTags = false;
	function onTagsChange() {
		updatingTags = true;
		updateLesson(organizationId, lesson.id, {
			unitId,
			tags: lesson.tags
		}).finally(() => {
			updatingTags = false;
		});
	}

	const debouncedUpdateDescription = debounce(
		() =>
			updateLesson(organizationId, lesson.id, {
				unitId,
				description: lesson.description
			}),
		3000
	);

	let updatingPublished = false;
	function onPublishedChange() {
		updatingPublished = true;
		lesson.published = !lesson.published;
		updateLesson(organizationId, lesson.id, {
			unitId,
			published: lesson.published
		}).finally(() => {
			updatingPublished = false;
		});
	}

	const debouncedOnTagsChange = debounce(onTagsChange, 3000);

	const debouncedUpdateContent = debounce(
		() =>
			updateLesson(organizationId, lesson.id, {
				unitId,
				content: lesson.content
			}),
		3000
	);
</script>

<div class="container mb-2">
	<div class="row justify-content-between">
		<div class="col-md">
			<form class="row" on:submit|preventDefault>
				<div class="col-md">
					<label for="lesson-name" class="form-label">Lesson Name</label>
					<input
						id="lesson-name"
						type="text"
						class="form-control"
						placeholder="Enter Name"
						bind:value={lesson.name}
						on:change={onNameChange}
					/>
				</div>
				<div class="col-md">
					<label for="lesson-tags" class="form-label mb-0">Lesson Tags</label>
					<Tags
						id="lesson-tags"
						bind:tags={lesson.tags}
						loading={updatingTags}
						on:change={debouncedOnTagsChange}
					/>
				</div>
			</form>
		</div>
		<div class="col-md">
			<div class="d-flex mt-2 justify-content-end">
				<div class="p-1" />
				<div class="p-1" />
				<button
					type="button"
					class="btn"
					class:btn-primary={lesson.published}
					class:btn-outline-primary={!lesson.published}
					disabled={updatingPublished}
					on:click={onPublishedChange}
				>
					{#if lesson.published}
						<i class="bi bi-eye" />
					{:else}
						<i class="bi bi-eye-slash" />
					{/if}
				</button>
			</div>
		</div>
	</div>
	<div class="mt-2">
		<label for="lesson-description">Description</label>
		<RichEditor bind:content={lesson.description} on:change={debouncedUpdateDescription} />
	</div>
</div>

<div class="container">
	<label for="lesson-content" class="form-label mb-0">Content</label>
	<RichEditor bind:content={lesson.content} on:change={debouncedUpdateContent} />
</div>
