<svelte:options immutable />

<script lang="ts">
	import Prompt from './Prompt.svelte';
	import MarkAsReadContent from './MarkAsReadContent.svelte';
	import type { QuestionType, Result } from '@prisma/client';
	import type { Answer, MarkAsRead, MarkAsReadAnswer } from '$lib/types';

	export let type: QuestionType;
	export let prompt: MarkAsRead;
	export let input: MarkAsReadAnswer | undefined = undefined;
	export let result: Result | undefined = undefined;
	export let onExplain: () => Promise<Result>;
	export let onSubmit: (answer: Answer) => Promise<Result>;
	export let disabled = false;
</script>

<Prompt {type} {input} bind:result {disabled} {onExplain} {onSubmit}>
	<MarkAsReadContent slot="content" {prompt} />
	<slot slot="extra" name="extra" />
</Prompt>
