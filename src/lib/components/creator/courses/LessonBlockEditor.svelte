<script lang="ts">
	import type { StateLesson } from '$lib/state/creator/lessons';
	import { updateLessonBlock, type StateLessonBlock } from '$lib/state/creator/lessonBlocks';
	import RichEditor from '$lib/components/editor/RichEditor.svelte';
	import PromptEditor from '../prompts/PromptEditor.svelte';
	import { debounce } from '@aicacia/debounce';
	import { addNotification, NotificationType } from '$lib/state/notifications';

	export let id: string;
	export let index: number;
	export let lesson: StateLesson;
	export let lessonBlock: StateLessonBlock;

	$: prompt = lessonBlock.prompt as any;

	let updatingLessonBlock = false;
	async function onChange() {
		updatingLessonBlock = true;
		try {
			const { id, lesson, ...data } = lessonBlock;
			await updateLessonBlock(lessonBlock.id, data);
		} catch (e) {
			console.error(e);
			addNotification({
				type: NotificationType.Danger,
				description: (e as Error).message
			});
		}
	}

	const debouncedOnChange = debounce(onChange, 1000);
</script>

<div data-id={id} data-index={index} class="accordion-item">
	<h2 class="accordion-header" id={`accordion-heading-${lessonBlock.id}`}>
		<button
			class="accordion-button"
			type="button"
			data-bs-toggle="collapse"
			data-bs-target={`#accordion-collapse-${lessonBlock.id}`}
			aria-expanded="false"
			aria-controls={`accordion-collapse-${lessonBlock.id}`}
		>
			{lessonBlock.lesson.chapter.index + 1}.{lessonBlock.lesson.index + 1}.{lessonBlock.index + 1}
			{lessonBlock.type}
		</button>
	</h2>
	<div
		id={`accordion-collapse-${lessonBlock.id}`}
		class="accordion-collapse collapse show my-4"
		aria-labelledby={`accordion-heading-${lessonBlock.id}`}
		data-bs-parent={`accordion-${lesson.id}`}
	>
		<div class="row">
			<div class="col">
				<label for="lesson-blocktype" class="form-label">Type</label>
				<select
					name="lesson-blocktype"
					class="form-select"
					bind:value={lessonBlock.type}
					aria-label="lessonBlock Type"
					on:input={debouncedOnChange}
				>
					<option value={'MULTIPLE_CHOICE'}>Multiple Choice</option>
					<option value={'INPUT'}>Input</option>
					<option value={'FLASH_CARD'}>Flash Card</option>
					<option value={'MARK_AS_READ'}>Mark as Read</option>
				</select>
			</div>
		</div>
		<div class="row">
			<div class="col">
				<label for="description" class="form-label">Description</label>
				<RichEditor
					id="description"
					bind:value={lessonBlock.description}
					onChange={debouncedOnChange}
				/>
			</div>
		</div>
		<PromptEditor type={lessonBlock.type} {prompt} />
	</div>
</div>
