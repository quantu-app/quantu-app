<script lang="ts">
	import type { Question, QuestionMarkAsRead, QuestionResult } from '$lib/api/quantu-app-api';
	import Prompt from './Prompt.svelte';
	import MarkAsReadContent from './MarkAsReadContent.svelte';

	export let question: Question;
	export let result: QuestionResult = undefined;
	export let input = true;

	$: prompt = question.prompt as QuestionMarkAsRead;
</script>

<Prompt {question} {input} bind:result>
	<MarkAsReadContent slot="content" {prompt} />
	<slot slot="extra" name="extra" />
</Prompt>
