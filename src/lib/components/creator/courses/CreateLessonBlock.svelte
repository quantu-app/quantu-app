<svelte:options immutable />

<script lang="ts">
	import type { StateCourse } from '$lib/state/creator/courses';
	import type { StateDepartment } from '$lib/state/creator/departments';
	import type { StateLesson } from '$lib/state/creator/lessons';
	import { addNotification, NotificationType } from '$lib/state/notifications';
	import Modal from '$lib/components/ui/Modal.svelte';
	import type { StateChapter } from '$lib/state/creator/chapters';
	import { createLessonBlock } from '$lib/state/creator/lessonBlocks';
	import { QuestionType } from '@prisma/client';
	import { convertToUrlSafe, isUrlSafe } from '$lib/utils';

	export let department: StateDepartment;
	export let course: StateCourse;
	export let chapter: StateChapter;
	export let lesson: StateLesson;
	export let open = false;

	let lessonBlockType: QuestionType = QuestionType.MULTIPLE_CHOICE;
	let lessonBlockName = '';
	let lessonBlockUrl = '';
	let invalidFormData = true;

	$: lessonBlockUrl = convertToUrlSafe(lessonBlockName, '-');
	$: invalidFormData = !isUrlSafe(lessonBlockUrl) || lessonBlockName.trim().length == 0;

	let creatingLesson = false;
	async function onCreateLesson() {
		creatingLesson = true;
		try {
			const promise = createLessonBlock(lesson.id, {
				name: lessonBlockName,
				url: lessonBlockUrl,
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

			// reset form values
			lessonBlockType = QuestionType.MULTIPLE_CHOICE;
			lessonBlockName = '';
			lessonBlockUrl = '';
		}
	}
</script>

<Modal bind:open>
	<svelte:fragment slot="header">Create Learning Block in {chapter.name}</svelte:fragment>
	<div class="row">
		<div class="col-6">
			<label for="lesson-block--name" class="form-label">Name</label>
			<input
				type="text"
				class:is-invalid={lessonBlockName.length > 0 && lessonBlockName.trim().length == 0}
				bind:value={lessonBlockName}
				class="form-control"
			/>
		</div>
		<div class="col-6">
			<label for="lesson-block--url" class="form-label">Url</label>
			<input
				type="text"
				class:is-invalid={lessonBlockUrl.length > 0 && !isUrlSafe(lessonBlockUrl)}
				bind:value={lessonBlockUrl}
				class="form-control"
			/>
		</div>
	</div>
	<div class="row mt-2">
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
	<button
		slot="footer"
		class="btn btn-primary"
		on:click={onCreateLesson}
		disabled={invalidFormData || creatingLesson}>Create</button
	>
</Modal>
