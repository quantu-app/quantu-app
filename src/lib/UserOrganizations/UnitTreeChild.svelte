<script lang="ts">
	import type { Quiz, Lesson } from '$lib/api/quantu-app-api';
	import { updateLesson } from '$lib/state/organizationLessons';
	import { updateQuiz } from '$lib/state/organizationQuizzes';
	import { organizationPath } from '$lib/utils';

	export let organizationId: number;
	export let courseId: number = undefined;
	export let unitId: number = undefined;
	export let index: number = undefined;
	export let child: Quiz | Lesson;

	let updatingPublished = false;
	async function onPublishedChange() {
		updatingPublished = true;
		child.published = !child.published;
		try {
			const updates = {
				unitId,
				published: child.published
			};
			if (child.type === 'quiz') {
				await updateQuiz(organizationId, child.id, updates);
			} else if (child.type === 'lesson') {
				await updateLesson(organizationId, child.id, updates);
			}
		} finally {
			updatingPublished = false;
		}
	}
</script>

<div class="ms-2 d-flex flex-row justify-content-between">
	<h5 class="d-flex">
		<a href={organizationPath(organizationId, courseId, unitId, child.id, child.type)}
			>{index + 1} - {child.name}</a
		>
	</h5>
	<button
		type="button"
		class="d-flex btn"
		class:btn-primary={child.published}
		class:btn-outline-primary={!child.published}
		disabled={updatingPublished}
		on:click={onPublishedChange}
	>
		{#if child.published}
			<i class="bi bi-eye" />
		{:else}
			<i class="bi bi-eye-slash" />
		{/if}
	</button>
</div>
