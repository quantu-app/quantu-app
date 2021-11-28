<script lang="ts">
	import type { Lesson } from '$lib/api/quantu-app-api';
	import Search from '$lib/Search.svelte';
	import { debounce } from '@aicacia/debounce';
	import { updateLesson } from '$lib/state/organizationLessons';
	import Tags from '$lib/Tags.svelte';
	import RichEditor from '$lib/RichEditor.svelte';
	import type Quill from 'quill';
	import type Delta from 'quill-delta';

	export let organizationId: number;
	export let courseId: number = undefined;
	export let unitId: number = undefined;
	export let lesson: Lesson;

	function onNameChange() {
		updateLesson(organizationId, lesson.id, {
			name: lesson.name
		});
	}

	let updatingTags = false;
	function onTagsChange() {
		updatingTags = true;
		updateLesson(organizationId, lesson.id, {
			tags: lesson.tags
		}).finally(() => {
			updatingTags = false;
		});
	}

	function onDescriptionChange() {
		updateLesson(organizationId, lesson.id, {
			description: lesson.description
		});
	}

	let updatingPublished = false;
	function onPublishedChange() {
		updatingPublished = true;
		lesson.published = !lesson.published;
		updateLesson(organizationId, lesson.id, {
			published: lesson.published
		}).finally(() => {
			updatingPublished = false;
		});
	}

	const debouncedOnTagsChange = debounce(onTagsChange, 3000);

	let quill: Quill | undefined;
	function onContent(q: Quill) {
		quill = q;
		quill.setContents({ ops: lesson.content } as Delta, 'api');
	}

	$: onContentChange = () => {
		if (quill) {
			lesson.content = quill.getContents().ops;
			debouncedUpdateContent();
		}
	};

	function updateContent() {
		updateLesson(organizationId, lesson.id, {
			content: lesson.content
		});
	}

	const debouncedUpdateContent = debounce(updateContent, 3000);
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
		<textarea
			class="form-control"
			placeholder="Lesson Description"
			id="lesson-description"
			bind:value={lesson.description}
			on:change={onDescriptionChange}
		/>
	</div>
</div>

<div class="container">
	<label for="lesson-content" class="form-label mb-0">Content</label>
	<RichEditor onQuill={onContent} on:textchange={onContentChange} />
</div>
