<script lang="ts">
	import type { InputType } from '$lib/types';

	export let type: InputType;
	export let input: string;
	export let correct: boolean | undefined = undefined;
	export let disabled = false;

	let prevType: InputType;
	let mathElement: HTMLElement;

	$: if (prevType !== type && mathElement) {
		prevType = type;
		const MQ = window.MathQuill.getInterface(2);
		const mathField = MQ.MathField(mathElement, {
			handlers: {
				edit: function () {
					input = mathField.latex();
				}
			}
		});
		mathField.latex(input.trim());
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
		/>
	</div>
{/if}

<style>
	span {
		width: 100%;
		text-align: center;
	}
</style>
