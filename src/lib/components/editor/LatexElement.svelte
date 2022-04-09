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
		const { isVoid, isInline } = editor;

		editor.isInline = (element) =>
			isLatexElement(element as IBaseElement) ? !!element['inline'] : isInline(element);

		editor.isVoid = (element) => (isLatexElement(element as IBaseElement) ? true : isVoid(element));

		return editor;
	}

	export function insertLatex(editor: Editor, latex: string, inline: boolean, at?: Location) {
		const node = { type: 'latex', latex, inline, children: [{ text: '' }] };
		if (inline) {
			Editor.withoutNormalizing(editor, () => {
				Transforms.insertNodes(editor, [node], { at });
			});
		} else {
			Transforms.insertNodes(editor, [node], { at });
		}
	}
</script>

<script lang="ts">
	import { isReadOnly, findPath, getEditor, type ISvelteEditor } from 'svelte-slate';
	import { Editor, Location, Transforms } from 'slate';
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
		if (element.inline !== inline) {
			onDelete();
			insertLatex(editor, latex, inline, path);
		} else {
			Transforms.setNodes(editor, { latex } as any, { at: path });
			open = false;
		}
	}
	function onDelete() {
		open = false;
		Transforms.delete(editor, { at: path });
	}

	let latex = currentLatex;
	let inline = currentInline;
	function onEdit() {
		if (!isReadOnly(editor)) {
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
	class="latex-element"
	class:inline={currentInline}
	bind:this={ref}
	data-slate-node="element"
	data-slate-inline={isInline}
	data-slate-void={isVoid}
	{dir}
	{contenteditable}
>
	<slot />
	<div class:inline={currentInline} contenteditable={false}>
		<span bind:this={latexElement} on:mousedown={onEdit} on:touchstart={onEdit} />
	</div>
</div>

<LatexEditor bind:open {latex} {inline} {onDone} {onDelete} />

<style>
	.latex-element {
		position: relative;
		margin: 0;
	}
	.inline {
		display: inline;
	}
</style>
