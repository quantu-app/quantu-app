<script lang="ts" context="module">
	import 'katex/dist/katex.min.css';
	import type { IBaseElement } from './Element.svelte';

	export interface ILatexElement extends IBaseElement {
		type: 'latex';
		latex: string;
		inline: boolean;
	}

	export function isLatexElement(element: IBaseElement): element is ILatexElement {
		return element.type === 'latex';
	}

	export function withLatex<T extends ISvelteEditor = ISvelteEditor>(editor: T): T {
		const { isVoid } = editor;

		editor.isVoid = (element) => {
			return isLatexElement(element as IBaseElement) ? true : isVoid(element);
		};

		return editor;
	}

	export function insertLatex(editor: Editor) {
		const image = { type: 'latex', latex: '', inline: true, children: [{ text: ' ' }] };
		Transforms.insertNodes(editor, image);
	}
</script>

<script lang="ts">
	import { DECORATE_CONTEXT_KEY, defaultDecorate } from 'svelte-slate/components/Slate.svelte';
	import type { ISvelteEditor } from 'svelte-slate';
	import { findPath } from 'svelte-slate';
	import { getEditor } from 'svelte-slate';
	import { Editor, Transforms } from 'slate';
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';
	import Button from './Button.svelte';
	import katex from 'katex';
	import Modal from './Modal.svelte';

	export let element: ILatexElement;
	export let isInline: boolean;
	export let isVoid: boolean;
	export let contenteditable: boolean;
	export let ref: HTMLElement = undefined;
	export let dir: 'rtl' | 'ltr' = undefined;

	const editor = getEditor();

	const decorateContext = writable(defaultDecorate);
	setContext(DECORATE_CONTEXT_KEY, decorateContext);

	$: path = findPath(element);
	let currentLatex = element.latex;
	$: if (currentLatex !== element.latex) {
		currentLatex = element.latex;
	}
	let currentInline = element.inline;
	$: if (currentInline !== element.inline) {
		currentInline = element.inline;
	}

	let latexElement: HTMLElement;
	$: if (latexElement) {
		if (currentLatex) {
			katex.render(currentLatex, latexElement, {
				displayMode: !currentInline,
				output: 'html',
				throwOnError: false
			});
		} else if (contenteditable) {
			latexElement.innerHTML = 'Click to Edit LaTeX';
		}
	}

	let editing = false;
	let latex: string;
	let inline: boolean;
	function onEdit() {
		latex = currentLatex;
		inline = currentInline;
		editing = true;
	}
	$: onLatexChange = () => {
		Transforms.setNodes(editor, { latex, inline } as any, { at: path });
		editing = false;
	};
	function onInlineChange() {
		inline = !inline;
	}
	$: onDelete = () => {
		Transforms.delete(editor, { at: path });
	};

	let latexDisplayElement: HTMLElement;
	$: if (editing && latexDisplayElement) {
		katex.render(latex, latexDisplayElement, {
			displayMode: !inline,
			output: 'html',
			throwOnError: false
		});
	}
</script>

<div
	class="container"
	class:inline={currentInline}
	bind:this={ref}
	data-slate-node="element"
	data-slate-inline={isInline}
	data-slate-void={isVoid}
	{dir}
	{contenteditable}
>
	<div contenteditable={false}><span bind:this={latexElement} on:mousedown={onEdit} /></div>
	<slot />
</div>

<Modal bind:open={editing}>
	<div class="body">
		<div class="editor">
			<div class="latex">
				<div>
					<textarea bind:value={latex} />
				</div>
				<div>
					<span bind:this={latexDisplayElement} />
				</div>
			</div>
			<div class="buttons">
				<div>
					<Button active={!latex} onClick={onLatexChange}><i class="bi bi-check" /></Button>
				</div>
				<div>
					<Button onClick={onDelete}><i class="bi bi-trash" /></Button>
				</div>
				<div>
					<Button active={!inline} onClick={onInlineChange}><i class="bi bi-forward" /></Button>
				</div>
			</div>
		</div>
	</div></Modal
>

<style>
	.container {
		position: relative;
		margin: 0;
	}
	.inline {
		display: inline-block;
	}
	.body {
		background-color: white;
	}
	.editor {
		display: flex;
	}
	.latex {
		flex-direction: column;
	}
	.buttons {
		flex-direction: row;
		flex-grow: 0;
	}
	textarea {
		resize: vertical;
		border: 1px solid #888;
		padding: 0.25rem 0.5rem;
		min-width: 300px;
		outline: none;
	}
</style>
