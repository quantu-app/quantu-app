<svelte:options immutable />

<script lang="ts">
	import FlashCard from './FlashCard.svelte';
	import Input from './Input.svelte';
	import MultipleChoice from './multiple_choice/MultipleChoice.svelte';
	import MarkAsRead from './MarkAsRead.svelte';
	import type { StateChallenge } from '$lib/state/challenges';
	import { answer, explain } from '$lib/state/challenges';
	import type { Result } from '@prisma/client';
	import type { Answer } from '$lib/types';

	export let challenge: StateChallenge;
	export let seed: number | undefined = undefined;
	export let result: Result | undefined = undefined;
	export let disabled = false;

	let prevQuesion: StateChallenge;

	$: if (prevQuesion !== challenge) {
		prevQuesion = challenge;
		result = undefined;
	}

	function onExplain() {
		return explain(challenge.id);
	}

	function onSubmit(a: Answer) {
		return answer(challenge.id, a);
	}
</script>

{#key challenge.id}
	{#if challenge.type === 'FLASH_CARD'}
		<FlashCard
			type={challenge.type}
			prompt={challenge.prompt}
			bind:result
			{disabled}
			{onExplain}
			{onSubmit}
		>
			<slot slot="extra" name="extra" />
		</FlashCard>
	{:else if challenge.type === 'MULTIPLE_CHOICE'}
		<MultipleChoice
			type={challenge.type}
			{seed}
			prompt={challenge.prompt}
			bind:result
			{disabled}
			{onExplain}
			{onSubmit}
		>
			<slot slot="extra" name="extra" />
		</MultipleChoice>
	{:else if challenge.type === 'INPUT'}
		<Input
			type={challenge.type}
			prompt={challenge.prompt}
			bind:result
			{disabled}
			{onExplain}
			{onSubmit}
		>
			<slot slot="extra" name="extra" />
		</Input>
	{:else if challenge.type === 'MARK_AS_READ'}
		<MarkAsRead
			type={challenge.type}
			prompt={challenge.prompt}
			bind:result
			{disabled}
			{onExplain}
			{onSubmit}
		>
			<slot slot="extra" name="extra" />
		</MarkAsRead>
	{/if}
{/key}
