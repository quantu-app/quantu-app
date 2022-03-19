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

	export function insertLatex(editor: Editor, latex: string, inline: boolean) {
		const image = { type: 'latex', latex, inline, children: [{ text: '' }] };
		Transforms.insertNodes(editor, image);
	}
</script>

<script lang="ts">
	import { type ISvelteEditor } from 'svelte-slate';
	import { findPath } from 'svelte-slate';
	import { getEditor } from 'svelte-slate';
	import { Editor, Transforms } from 'slate';
	import katex from 'katex';
	import LatexEditor from './LatexEditor.svelte';
	export let element: ILatexElement;
	export let isInline: boolean;
	export let isVoid: boolean;
	export let contenteditable: boolean;
	export let ref: HTMLElement = undefined;
	export let dir: 'rtl' | 'ltr' = undefined;

	const editor = getEditor();

	$: path = findPath(element);
	let currentLatex = element.latex;
	$: if (currentLatex !== element.latex) {
		currentLatex = element.latex;
	}
	let currentInline = element.inline;
	$: if (currentInline !== element.inline) {
		currentInline = element.inline;
	}

	let open = false;

	function onDone(latex: string, inline: boolean) {
		Transforms.setNodes(editor, { latex, inline } as any, { at: path });
		open = false;
	}
	function onDelete() {
		open = false;
		Transforms.delete(editor, { at: path });
	}

	let latex = currentLatex;
	let inline = currentInline;
	function onEdit() {
		if (contenteditable) {
			latex = currentLatex;
			inline = currentInline;
			open = true;
		}
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
			onDelete();
		}
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
	<div class:inline={currentInline} contenteditable={false}>
		<span bind:this={latexElement} on:mousedown={onEdit} on:touchstart={onEdit} />
	</div>
	<slot />
</div>

<LatexEditor bind:open bind:latex bind:inline {onDone} {onDelete} />

<style>
	.container {
		position: relative;
		margin: 0;
	}
	.inline {
		display: inline;
	}
</style>
