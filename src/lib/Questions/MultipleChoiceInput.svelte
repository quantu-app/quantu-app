<script lang="ts">
	import type { QuestionMultipleChoice } from '$lib/api/quantu-app-api';
	import RichViewer from '$lib/RichViewer.svelte';
	import { XorShiftRng } from '@aicacia/rand';

	export let prompt: QuestionMultipleChoice;
	export let input: string[] = [];
	export let correct: Record<string, true> = undefined;
	export let disabled = false;
	export let seed: number = undefined;

	$: choices = XorShiftRng.fromSeed(seed).shuffle(Object.entries(prompt.choices));

	let checked: Record<string, boolean> = {};
	$: if (disabled) {
		checked = input.reduce((checked, key) => {
			checked[key] = true;
			return checked;
		}, {} as Record<string, boolean>);
	} else {
		input = Object.keys(checked).filter((key) => checked[key]);
	}
</script>

<ul class="list-group list-group-flush">
	{#each choices as [key, choice], index}
		<li
			class="list-group-item"
			class:list-group-item-success={correct && correct[key]}
			class:list-group-item-danger={correct && !correct[key] && checked[key]}
		>
			<div class="d-flex">
				<div class="flex-shink-0">
					<input
						class="form-check-input me-2"
						type="checkbox"
						{disabled}
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
