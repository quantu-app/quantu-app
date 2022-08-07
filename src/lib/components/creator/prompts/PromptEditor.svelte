<svelte:options immutable />

<script lang="ts">
	import type {
		FlashCardPrivate,
		MultipleChoicePrivate,
		InputPrivate,
		MarkAsReadPrivate
	} from '$lib/types';
	import FlashCardEditor from '$lib/components/creator/prompts/FlashCardEditor.svelte';
	import InputEditor from '$lib/components/creator/prompts/InputEditor.svelte';
	import MultipleChoiceEditor from '$lib/components/creator/prompts/MultipleChoiceEditor.svelte';
	import MarkAsReadEditor from '$lib/components/creator/prompts/MarkAsReadEditor.svelte';

	export let type: string;
	export let prompt: FlashCardPrivate | MultipleChoicePrivate | InputPrivate | MarkAsReadPrivate;
	export let disabled = false;
	export let onChange: () => void = () => undefined;

	$: promptFlashCard = prompt as FlashCardPrivate;
	$: promptMultipleChoice = prompt as MultipleChoicePrivate;
	$: promptInput = prompt as InputPrivate;
	$: promptMarkAsRead = prompt as MarkAsReadPrivate;
</script>

{#if type === 'FLASH_CARD'}
	<FlashCardEditor {disabled} bind:prompt={promptFlashCard} {onChange} />
{:else if type === 'MULTIPLE_CHOICE'}
	<MultipleChoiceEditor {disabled} bind:prompt={promptMultipleChoice} {onChange}/>
{:else if type === 'INPUT'}
	<InputEditor {disabled} bind:prompt={promptInput} {onChange}/>
{:else if type === 'mark_as_read'}
	<MarkAsReadEditor {disabled} bind:prompt={promptMarkAsRead} {onChange}/>
{/if}
