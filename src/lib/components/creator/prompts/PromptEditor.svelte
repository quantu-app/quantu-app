<script lang="ts">
	import type {
		FlashCardPrivate,
		MultipleChoicePrivate,
		InputPrivate,
		MarkAsReadPrivate
	} from '$lib/components/types';
	import FlashCardEditor from '$lib/components/creator/prompts/FlashCardEditor.svelte';
	import InputEditor from '$lib/components/creator/prompts/InputEditor.svelte';
	import MultipleChoiceEditor from '$lib/components/creator/prompts/MultipleChoiceEditor.svelte';
	import MarkAsReadEditor from '$lib/components/creator/prompts/MarkAsReadEditor.svelte';
	import { ChallengeType } from '@prisma/client';

	export let type: string;
	export let prompt: FlashCardPrivate | MultipleChoicePrivate | InputPrivate | MarkAsReadPrivate;
	export let disabled = false;

	$: promptFlashCard = prompt as FlashCardPrivate;
	$: promptMultipleChoice = prompt as MultipleChoicePrivate;
	$: promptInput = prompt as InputPrivate;
	$: promptMarkAsRead = prompt as MarkAsReadPrivate;
</script>

{#if type === ChallengeType.FLASH_CARD}
	<FlashCardEditor {disabled} bind:prompt={promptFlashCard} />
{:else if type === ChallengeType.MULTIPLE_CHOICE}
	<MultipleChoiceEditor {disabled} bind:prompt={promptMultipleChoice} />
{:else if type === ChallengeType.INPUT}
	<InputEditor {disabled} bind:prompt={promptInput} />
{:else if type === 'mark_as_read'}
	<MarkAsReadEditor {disabled} bind:prompt={promptMarkAsRead} />
{/if}
