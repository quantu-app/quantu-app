<script lang="ts">
	import RichViewer from '$lib/components/editor/RichViewer.svelte';
	import type { MultipleChoice } from '$lib/types';
	import { XorShiftRng } from '@aicacia/rand';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';

	export let prompt: MultipleChoice;
	export let input: string[] = [];
	export let correct: Record<string, true> = undefined;
	export let disabled = false;
	export let seed: number = undefined;
	export let reviewMode: boolean = false;

	$: choices = XorShiftRng.fromSeed(seed).shuffle([...prompt.choices]);

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

<ul class="choices-list list-group list-group-flush">
	{#each choices as choice (choice.id)}
		<li
			class={'list-group-item' + (reviewMode ? ' review-mode' : '')}
			class:list-group-item-success={correct && correct[choice.id]}
			class:list-group-item-danger={correct && !correct[choice.id] && checked[choice.id]}
		>
			<div class="d-flex">
				<div class="flex-shink-0 flex-row justify-content-center align-self-center me-3">
					<Checkbox
						{disabled}
						value={checked[choice.id] + ''}
						checked={!!checked[choice.id]}
						onChange={createOnChange(choice.id)}
					/>
				</div>
				<div class="flex-grow-1 pt-2">
					<RichViewer value={choice.content} />
				</div>
			</div>
		</li>
	{/each}
</ul>

<style>
	.choices-list {
		background: #f5f5f5;
		border: 1px solid #707070;
	}
	.choices-list .list-group-item {
		border: 1px solid #707070;
	}
	.list-group-flush .list-group-item.review-mode {
		opacity: 0.65;
	}
	.list-group-flush .list-group-item.review-mode.list-group-item-success,
	.list-group-flush .list-group-item.review-mode.list-group-item-danger {
		opacity: 1;
		color: #202020;
	}
	.list-group-flush .list-group-item.list-group-item-success {
		background: rgb(218, 236, 253);
		opacity: 1;
	}
	.list-group-flush .list-group-item.list-group-item-danger {
		background: #ed6161;
		opacity: 1;
	}
</style>
