<svelte:options immutable />

<script lang="ts">
	import RichViewer from '$lib/components/editor/RichViewer.svelte';
	import type { MultipleChoice } from '$lib/types';
	import { XorShiftRng } from '@aicacia/rand';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';

	export let prompt: MultipleChoice;
	export let input: string[] = [];
	export let correct: Record<string, true> = {};
	export let disabled = false;
	export let seed: number | undefined = undefined;

	$: choices = XorShiftRng.fromSeed(seed).shuffle([...prompt.choices]);

	let selected: Record<string, boolean> = {};
	$: createOnChange = (key: string) => () => {
		if (prompt.singleAnswer) {
			selected = { [key]: !selected[key] };
		} else {
			selected = { ...selected, [key]: !selected[key] };
		}
	};
	$: if (disabled) {
		selected = (Array.isArray(input) ? input : []).reduce((selected, key) => {
			selected[key] = true;
			return selected;
		}, {} as Record<string, boolean>);
	} else {
		input = Object.keys(selected).filter((key) => selected[key]);
	}
</script>

<ul class="choices-list list-group">
	{#each choices as choice (choice.id)}
		{@const isCorrect = disabled && correct[choice.id]}
		{@const isIncorrect = disabled && !correct[choice.id] && !!selected[choice.id]}
		{@const onChange = createOnChange(choice.id)}

		<li
			class="list-group-item list-group-item-action border-0 rounded-2"
			class:list-group-item-success={isCorrect}
			class:list-group-item-danger={isIncorrect}
			class:list-group-item-secondary={selected[choice.id]}
			on:click={onChange}
		>
			<div class="d-flex">
				<div class="flex-shink-0 flex-row justify-content-center align-self-center me-3">
					<Checkbox
						{disabled}
						status={isCorrect ? 'success' : isIncorrect ? 'error' : undefined}
						checked={selected[choice.id]}
						{onChange}
					/>
				</div>
				<div class="flex-grow-1 pt-2">
					<RichViewer value={choice.content} />
				</div>
			</div>
		</li>
	{/each}
</ul>
