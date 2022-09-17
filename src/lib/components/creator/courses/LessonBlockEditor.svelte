<script lang="ts">
	import { updateLessonBlock, type StateLessonBlock } from '$lib/state/creator/lessonBlocks';
	import RichEditor from '$lib/components/editor/RichEditor.svelte';
	import PromptEditor from '../prompts/PromptEditor.svelte';
	import { addNotification, NotificationType } from '$lib/state/notifications';
	import { typeToName } from '$lib/types';
	import { isUrlSafe } from '$lib/utils';
	import DateTimeInput from '$lib/components/ui/DateTimeInput.svelte';
	import ViewingOptions from './ViewingOptions.svelte';

	export let lessonBlock: StateLessonBlock;

	$: prompt = lessonBlock.prompt as any;
	$: disabled = updatingLessonBlock;

	let updatingLessonBlock = false;
	async function onUpdateLessonBlock() {
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
		} finally {
			updatingLessonBlock = false;
		}
	}
</script>

<div class="mt-4 d-flex justify-content-between">
	<h3>
		{lessonBlock.name} [{lessonBlock.lesson.chapter.index + 1}.{lessonBlock.lesson.index +
			1}.{lessonBlock.index + 1}] ({typeToName(lessonBlock.type)})
	</h3>
	<button type="button" on:click={onUpdateLessonBlock} {disabled} class="btn btn-primary">
		{#if updatingLessonBlock}
			<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
		{/if}
		Update
	</button>
</div>

<div class="row">
	<div class="col-6">
		<label for="lesson-block--name" class="form-label">Name</label>
		<input
			type="text"
			class:is-invalid={lessonBlock.name.length > 0 && lessonBlock.name.trim().length == 0}
			bind:value={lessonBlock.name}
			class="form-control"
		/>
	</div>
	<div class="col-6">
		<label for="lesson-block--url" class="form-label">Url</label>
		<input
			type="text"
			class:is-invalid={lessonBlock.url.length > 0 && !isUrlSafe(lessonBlock.url)}
			bind:value={lessonBlock.url}
			class="form-control"
		/>
	</div>
</div>
<ViewingOptions item={lessonBlock} {disabled} />
<div class="row mt-2">
	<div class="col">
		<label for="lesson-blocktype" class="form-label">Type</label>
		<select
			name="lesson-blocktype"
			class="form-select"
			bind:value={lessonBlock.type}
			aria-label="lessonBlock Type"
		>
			<option value={'MULTIPLE_CHOICE'}>Multiple Choice</option>
			<option value={'INPUT'}>Input</option>
			<option value={'FLASH_CARD'}>Flash Card</option>
			<option value={'MARK_AS_READ'}>Mark as Read</option>
		</select>
	</div>
</div>
<div class="row mt-2">
	<div class="col">
		<label for="description" class="form-label">Description</label>
		<RichEditor id="description" name="description" bind:value={lessonBlock.description} />
	</div>
</div>
<PromptEditor type={lessonBlock.type} {prompt} />
