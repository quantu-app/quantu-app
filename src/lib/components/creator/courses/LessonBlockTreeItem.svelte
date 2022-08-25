<svelte:options immutable />

<script lang="ts">
	import ContextMenu from '$lib/components/ui/ContextMenu.svelte';

	import type { StateChapter } from '$lib/state/creator/chapters';
	import type { StateLessonBlock } from '$lib/state/creator/lessonBlocks';
	import type { StateLesson } from '$lib/state/creator/lessons';
	import { typeToIconName, typeToName } from '$lib/types';
	import { setSelected, selected } from './Course.svelte';
	import DeleteLessonBlock from './DeleteLessonBlock.svelte';

	export let id: string;
	export let index: number;
	export let chapter: StateChapter;
	export let lesson: StateLesson;
	export let lessonBlock: StateLessonBlock;

	function onSelectInternal() {
		setSelected('lesson-block', lessonBlock.id);
	}

	let lessonBlockElement: HTMLElement;

	let openDeleteLessonBlock = false;
	function onOpenDeleteLessonBlock(e: MouseEvent) {
		e.stopPropagation();
		openDeleteLessonBlock = true;
	}
</script>

<li
	bind:this={lessonBlockElement}
	data-id={id}
	data-index={index}
	class="list-group-item list-group-item-action"
	class:active={$selected === lessonBlock}
	on:click={onSelectInternal}
>
	<div class="d-flex flex-row ps-5">
		<div class="d-flex flex-grow-1 align-self-center m-0 p-0">
			<div class="lesson-block--id col-3">
				{chapter.index + 1}.{lesson.index + 1}.{lessonBlock.index}
			</div>
			<div class="lesson-block--name col-6">
				{lessonBlock.name}
			</div>
			<div class="lesson-block--typeIcon col-3 text-end">
				<i class="bi bi-{typeToIconName(lessonBlock.type)}" title={typeToName(lessonBlock.type)} />
			</div>
		</div>
	</div>
</li>

<ContextMenu target={lessonBlockElement}>
	<li>
		<button class="dropdown-item danger" on:click={onOpenDeleteLessonBlock}>Delete?</button>
	</li>
</ContextMenu>

<DeleteLessonBlock bind:open={openDeleteLessonBlock} {lessonBlock} />
