<svelte:options immutable />

<script lang="ts">
	import type { StateCourse } from '$lib/state/creator/courses';
	import type { StateDepartment } from '$lib/state/creator/departments';
	import type { StateLesson } from '$lib/state/creator/lessons';
	import { addNotification, NotificationType } from '$lib/state/notifications';
	import Modal from '$lib/components/ui/Modal.svelte';
	import type { StateChapter } from '$lib/state/creator/chapters';
	import { createLessonBlock } from '$lib/state/creator/lessonBlocks';
	import type { QuestionType } from '@prisma/client';

	export let department: StateDepartment;
	export let course: StateCourse;
	export let chapter: StateChapter;
	export let lesson: StateLesson;
	export let open = false;

	let lessonBlockType: QuestionType;
	let creatingLesson = false;
	async function onCreateLesson() {
		creatingLesson = true;
		try {
			const promise = createLessonBlock(lesson.id, {
				type: lessonBlockType,
				description: [],
				prompt: {}
			});
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
		<div class="col">
			<label for="lesson-blocktype" class="form-label">Type</label>
			<select
				name="lesson-blocktype"
				class="form-select"
				bind:value={lessonBlockType}
				aria-label="lessonBlock Type"
			>
				<option value={'MULTIPLE_CHOICE'}>Multiple Choice</option>
				<option value={'INPUT'}>Input</option>
				<option value={'FLASH_CARD'}>Flash Card</option>
				<option value={'MARK_AS_READ'}>Mark as Read</option>
			</select>
		</div>
	</div>
	<button slot="footer" class="btn btn-primary" on:click={onCreateLesson} disabled={creatingLesson}
		>Create</button
	>
</Modal>
