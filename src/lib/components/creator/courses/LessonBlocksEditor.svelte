<svelte:options immutable />

<script lang="ts">
	import type { StateLesson } from '$lib/state/creator/lessons';
	import { createLessonBlock, type StateLessonBlock } from '$lib/state/creator/lessonBlocks';
	import SortableList from '$lib/components/ui/SortableList.svelte';
	import LessonBlockEditor from './LessonBlockEditor.svelte';
	import { addNotification, NotificationType } from '$lib/state/notifications';

	export let lesson: StateLesson;
	export let lessonBlocks: StateLessonBlock[] = [];

	function getLessonBlockId(lessonBlock: StateLessonBlock) {
		return lessonBlock.id;
	}
	function onSortLessonBlocks(e: CustomEvent<StateLessonBlock[]>) {}

	let creatingLessonBlock = false;
	async function onCreateLessonBlock() {
		creatingLessonBlock = true;
		try {
			await createLessonBlock(lesson.id, {
				description: [],
				type: 'MULTIPLE_CHOICE',
				prompt: {}
			});
		} catch (e) {
			console.error(e);
			addNotification({
				type: NotificationType.Danger,
				description: (e as Error).message
			});
		} finally {
			creatingLessonBlock = false;
		}
	}
</script>

<ul class="list-group list-group-flush">
	<SortableList
		list={lessonBlocks}
		let:id
		let:index
		let:item
		getId={getLessonBlockId}
		on:change={onSortLessonBlocks}
	>
		<LessonBlockEditor {id} {index} {lesson} lessonBlock={item} />
	</SortableList>
</ul>

<div class="d-flex justify-content-center">
	<button
		class="btn btn-primary"
		type="button"
		disabled={creatingLessonBlock}
		on:click={onCreateLessonBlock}>Create Lesson Block</button
	>
</div>
