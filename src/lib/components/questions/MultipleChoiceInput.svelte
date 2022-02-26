<script lang="ts">
	import type { QuestionMultipleChoice } from '$lib/api/quantu-app-api';
	import RichViewer from '$lib/components/RichViewer.svelte';
	import { XorShiftRng } from '@aicacia/rand';

	export let prompt: QuestionMultipleChoice;
	export let input: string[] = [];
	export let correct: Record<string, true> = undefined;
	export let disabled = false;
	export let seed: number = undefined;

	$: choices = XorShiftRng.fromSeed(seed).shuffle(Object.entries(prompt.choices));

	let checked: Record<string, boolean> = {};
	$: createOnChange = (key: string) => {
		return function onChange() {
			if (prompt.singleAnswer) {
				checked = { [key]: true };
			} else {
				checked[key] = !checked[key];
			}
		};
	};
	$: if (disabled) {
		checked = (Array.isArray(input) ? input : []).reduce((checked, key) => {
			checked[key] = true;
			return checked;
		}, {} as Record<string, boolean>);
	} else {
		input = Object.keys(checked).filter((key) => checked[key]);
	}
</script>

<ul class="list-group list-group-flush">
	{#each choices as [key, choice]}
		<li
			class="list-group-item"
			class:list-group-item-success={correct && correct[key]}
			class:list-group-item-danger={correct && !correct[key] && checked[key]}
		>
			<div class="d-flex">
				<div class="flex-shink-0 flex-row">
					<input
						class="form-check-input me-2"
						type="checkbox"
						{disabled}
						value={checked[key] + ''}
						checked={!!checked[key]}
						on:change={createOnChange(key)}
					/>
				</div>
				<div class="flex-grow-1">
					<RichViewer content={choice.content} />
				</div>
			</div>
		</li>
	{/each}
</ul>
