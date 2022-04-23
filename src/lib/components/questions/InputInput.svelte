<svelte:options immutable />

<script lang="ts">
	import InputAnswerEditor from '$lib/components/creator/prompts/InputAnswerEditor.svelte';
	import type { InputType } from '$lib/types';

	export let type: InputType;
	export let input: string;
	export let correct: boolean | undefined = undefined;
	export let disabled = false;
</script>

<InputAnswerEditor {type} bind:input {correct} {disabled} />
