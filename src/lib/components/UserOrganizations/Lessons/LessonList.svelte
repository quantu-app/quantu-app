<script lang="ts">
	import type { Lesson } from '$lib/api/quantu-app-api';
	import { deleteLesson } from '$lib/state/organizationLessons';
	import DeleteLesson from './DeleteLesson.svelte';
	import LessonListItem from './LessonListItem.svelte';

	export let organizationId: number;
	export let courseId: number = undefined;
	export let unitId: number = undefined;
	export let lessons: Lesson[];

	let lessonToDelete: Lesson;

	function createOnDelete(lesson: Lesson) {
		return function onDelete() {
			lessonToDelete = lesson;
		};
	}

	async function onDeleteLesson() {
		if (lessonToDelete) {
			await deleteLesson(organizationId, lessonToDelete.id);
			lessonToDelete = undefined;
		}
	}
</script>

<div class="list-group list-group-flush">
	{#each lessons as lesson (lesson.id)}
		<LessonListItem
			{organizationId}
			{courseId}
			{unitId}
			{lesson}
			onDelete={createOnDelete(lesson)}
		/>
	{/each}
</div>

<DeleteLesson lesson={lessonToDelete} {onDeleteLesson} />
