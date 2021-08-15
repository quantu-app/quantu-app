<script lang="ts">
	import type { Question, QuestionMultipleChoice } from '$lib/api/quantu-app-api';
	import RichViewer from '$lib/RichViewer.svelte';
	import Prompt from './Prompt.svelte';

	export let question: Question;
	export let answered: boolean;
	export let result: number;

	let checked: Record<string, boolean> = {};

	$: prompt = question.prompt as QuestionMultipleChoice;
	$: input = Object.keys(checked).filter((key) => checked[key]);
</script>

<Prompt {question} bind:answered bind:input bind:result>
	<RichViewer slot="content" content={prompt.question} />
	<ul slot="input" class="list-group list-group-flush">
		{#each Object.entries(prompt.choices) as [key, choice], index}
			<li class="list-group-item">
				<div class="d-flex">
					<div class="flex-shink-0">
						<input
							class="form-check-input me-2"
							type="checkbox"
							value=""
							bind:checked={checked[key]}
						/>
						<span class="badge bg-primary py-2 px-3">
							{(index + 10).toString(36).toUpperCase()}
						</span>
					</div>
					<div class="flex-grow-1">
						<RichViewer content={choice.content} />
					</div>
				</div>
			</li>
		{/each}
	</ul>
	<slot slot="extra" name="extra" />
</Prompt>
