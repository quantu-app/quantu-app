<script lang="ts">
	import FlashCard from './FlashCard.svelte';
	import Input from './Input.svelte';
	import MultipleChoice from './MultipleChoice.svelte';
	import MarkAsRead from './MarkAsRead.svelte';
	import type { StateChallenge } from '$lib/state/challenges';
	import { QuestionType, Result, ResultType } from '@prisma/client';
	import { answer, explain } from '$lib/state/results';
	import type { Answer } from '$lib/types';

	export let challenge: StateChallenge;
	export let seed: number = undefined;
	export let result: Result = undefined;

	let prevQuesion: StateChallenge;

	$: if (prevQuesion !== challenge) {
		prevQuesion = challenge;
		result = undefined;
	}

	function onExplain() {
		return explain(ResultType.CHALLENGE, challenge.id);
	}
	async function onSubmit(a: Answer) {
		return answer(ResultType.CHALLENGE, challenge.id, a);
	}
</script>

{#key challenge.id}
	{#if challenge.type === QuestionType.FLASH_CARD}
		<FlashCard type={challenge.type} prompt={challenge.prompt} bind:result {onExplain} {onSubmit}>
			<slot slot="extra" name="extra" />
		</FlashCard>
	{:else if challenge.type === QuestionType.MULTIPLE_CHOICE}
		<MultipleChoice
			type={challenge.type}
			{seed}
			prompt={challenge.prompt}
			bind:result
			{onExplain}
			{onSubmit}
		>
			<slot slot="extra" name="extra" />
		</MultipleChoice>
	{:else if challenge.type === QuestionType.INPUT}
		<Input type={challenge.type} prompt={challenge.prompt} bind:result {onExplain} {onSubmit}>
			<slot slot="extra" name="extra" />
		</Input>
	{:else if challenge.type === QuestionType.MARK_AS_READ}
		<MarkAsRead type={challenge.type} prompt={challenge.prompt} bind:result {onExplain} {onSubmit}>
			<slot slot="extra" name="extra" />
		</MarkAsRead>
	{/if}
{/key}
