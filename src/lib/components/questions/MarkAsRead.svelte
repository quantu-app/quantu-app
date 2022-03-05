<script lang="ts">
	import Prompt from './Prompt.svelte';
	import MarkAsReadContent from './MarkAsReadContent.svelte';
	import type { QuestionType, Result } from '@prisma/client';
	import type { Answer, MarkAsRead, MarkAsReadAnswer } from '$lib/types';

	export let type: QuestionType;
	export let input: MarkAsReadAnswer;
	export let prompt: MarkAsRead;
	export let result: Result = undefined;
	export let onExplain: () => Promise<Result>;
	export let onSubmit: (answer: Answer) => Promise<Result>;
</script>

<Prompt {type} {input} bind:result {onExplain} {onSubmit}>
	<MarkAsReadContent slot="content" {prompt} />
	<slot slot="extra" name="extra" />
</Prompt>
