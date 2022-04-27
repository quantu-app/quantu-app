<svelte:options immutable />

<script lang="ts">
	import Button from './Button.svelte';
	import katex from 'katex';
	import Modal from './Modal.svelte';

	export let open = false;
	export let latex: string = '';
	export let inline: boolean = true;
	export let onDone: (latex: string, inline: boolean) => void;
	export let onDelete: () => void = undefined;

	function onDoneInternal() {
		open = false;
		onDone(latex, inline);
	}
	function onInlineChange() {
		inline = !inline;
	}

	let textarea: HTMLTextAreaElement;
	let latexDisplayElement: HTMLElement;
	$: if (open && latexDisplayElement) {
		katex.render(latex, latexDisplayElement, {
			displayMode: !inline,
			output: 'html',
			throwOnError: false
		});
	}
	$: if (open && textarea) {
		textarea.focus();
	}
</script>

<Modal bind:open>
	<div class="body">
		<div class="editor">
			<div class="latex">
				<div>
					<textarea bind:this={textarea} bind:value={latex} />
				</div>
				<div>
					<span bind:this={latexDisplayElement} />
				</div>
			</div>
			<div class="buttons">
				<div>
					<Button active={!latex} onClick={onDoneInternal}><i class="bi bi-check" /></Button>
				</div>
				<div>
					<Button active={!inline} onClick={onInlineChange}><i class="bi bi-forward" /></Button>
				</div>
				{#if onDelete}
					<div>
						<Button onClick={onDelete}><i class="bi bi-trash" /></Button>
					</div>
				{/if}
			</div>
		</div>
	</div></Modal
>

<style>
	.body {
		background-color: white;
	}
	.editor {
		display: flex;
	}
	.latex {
		flex-direction: column;
		flex-grow: 1;
	}
	.buttons {
		flex-direction: row;
		flex-grow: 0;
	}
	textarea {
		resize: vertical;
		border: 1px solid #888;
		padding: 0.25rem 0.5rem;
		width: 100%;
		outline: none;
	}
</style>
