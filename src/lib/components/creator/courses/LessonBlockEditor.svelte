<svelte:options immutable />

<script lang="ts">
	import type { StateLesson } from '$lib/state/creator/lessons';
	import type { StateLessonBlock } from '$lib/state/creator/lessonBlocks';
	import RichEditor from '$lib/components/editor/RichEditor.svelte';
	import PromptEditor from '../prompts/PromptEditor.svelte';

	export let id: string;
	export let index: number;
	export let lesson: StateLesson;
	export let lessonBlock: StateLessonBlock;

	$: prompt = lessonBlock.prompt as any;
</script>

<li data-id={id} data-index={index} class="list-group-item list-group-item-action">
	<div class="row mt-2 mb-4">
		<div class="col-6">
			<label for="lesson-block-description" class="form-label">Description</label>
			<RichEditor name="lesson-block-description" bind:value={lessonBlock.description} />
		</div>
	</div>
	<div class="row mt-2 mb-4">
		<PromptEditor type={lessonBlock.type} {prompt} />
	</div>
</li>
