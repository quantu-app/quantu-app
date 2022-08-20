<script lang="ts">
	import type { InputType } from '$lib/types';
	import katex from 'katex';

	export let type: InputType;
	export let input: string;
	export let correct: boolean | undefined = undefined;
	export let disabled = false;
	export let onChange: () => void = () => undefined;

	let prevType: InputType;
	let mathElement: HTMLElement;

	$: console.log(mathElement);

	$: if (prevType !== type && mathElement) {
		prevType = type;
		const MQ = window.MathQuill.getInterface(2);

		if (disabled) {
			katex.render(input, mathElement, { throwOnError: true });
		} else {
			const mathField = MQ.MathField(mathElement, {
				handlers: {
					edit: function () {
						input = mathField.latex();
						onChange();
					}
				}
			});
			mathField.latex(input.trim());
		}
	}
</script>

{#if type === 'latex'}
	<div class="input-group">
		<span
			class="border py-2"
			class:border-success={correct === true}
			class:border-danger={correct === false}
			bind:this={mathElement}
		/>
	</div>
{:else if type === 'text'}
	<div class="input-group">
		<input
			type="text"
			class="form-control"
			class:is-valid={correct === true}
			class:is-invalid={correct === false}
			placeholder="Type answer"
			{disabled}
			bind:value={input}
			on:change={onChange}
		/>
	</div>
{:else if type === 'number'}
	<div class="input-group">
		<input
			type="number"
			class="form-control"
			class:is-valid={correct === true}
			class:is-invalid={correct === false}
			placeholder="Type answer"
			{disabled}
			bind:value={input}
			on:change={onChange}
		/>
	</div>
{/if}

<style>
	span {
		width: 100%;
		text-align: center;
	}
</style>
