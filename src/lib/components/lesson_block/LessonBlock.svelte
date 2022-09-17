<svelte:options immutable />

<script lang="ts">
	import Input from '$lib/components/questions/Input.svelte';
	import MultipleChoice from '$lib/components/questions/multiple_choice/MultipleChoice.svelte';
	import MarkAsRead from '$lib/components/questions/MarkAsRead.svelte';
	import type { StateLessonBlock } from '$lib/state/lessonBlocks';
	import { answer, explain } from '$lib/state/lessonBlocks';
	import type { Result } from '@prisma/client';
	import type { Answer } from '$lib/types';

	export let lessonBlock: StateLessonBlock;
	export let seed: number | undefined = undefined;
	export let result: Result | undefined = undefined;
	export let disabled = false;

	let prevQuesion: StateLessonBlock;

	$: if (prevQuesion !== lessonBlock) {
		prevQuesion = lessonBlock;
		result = undefined;
	}

	function onExplain() {
		return explain(lessonBlock.id);
	}
	function onSubmit(a: Answer) {
		return answer(lessonBlock.id, a);
	}
</script>

{#key lessonBlock.id}
	{#if lessonBlock.type === 'MULTIPLE_CHOICE'}
		<MultipleChoice
			type={lessonBlock.type}
			{seed}
			prompt={lessonBlock.prompt}
			bind:result
			{disabled}
			{onExplain}
			{onSubmit}
		>
			<slot slot="extra" name="extra" />
		</MultipleChoice>
	{:else if lessonBlock.type === 'INPUT'}
		<Input
			type={lessonBlock.type}
			prompt={lessonBlock.prompt}
			bind:result
			{disabled}
			{onExplain}
			{onSubmit}
		>
			<slot slot="extra" name="extra" />
		</Input>
	{:else if lessonBlock.type === 'MARK_AS_READ'}
		<MarkAsRead
			type={lessonBlock.type}
			prompt={lessonBlock.prompt}
			bind:result
			{disabled}
			{onExplain}
			{onSubmit}
		>
			<slot slot="extra" name="extra" />
		</MarkAsRead>
	{/if}
{/key}
