<script lang="ts">
	import InputInput from './InputInput.svelte';
	import InputContent from './InputContent.svelte';
	import Review from './Review.svelte';
	import type { Result } from '@prisma/client';
	import type { InputPrivate, InputAnswer } from '$lib/types';
	import RichViewer from '../Editor/RichViewer.svelte';

	export let result: Result;

	$: prompt = result.prompt as unknown as InputPrivate;
	$: input = result.answer as unknown as InputAnswer;
</script>

<Review>
	<InputContent slot="content" {prompt} />
	<InputInput
		slot="input"
		disabled={true}
		correct={result.value >= 0.5}
		type={prompt.type}
		{input}
	/>
	<slot slot="extra" name="extra" />
	<div name="explanation" slot="explanation">
		{#if prompt.explanation && prompt.explanation.length}
			<hr />
			<div class="mb-4">
				<h1>Explanation</h1>
				<RichViewer value={prompt.explanation} />
			</div>
		{/if}
	</div>
</Review>
