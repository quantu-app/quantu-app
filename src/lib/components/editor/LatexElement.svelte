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
		const { isVoid, isInline, insertBreak } = editor;

		editor.isInline = (element) =>
			isLatexElement(element as IBaseElement) ? !!element['inline'] : isInline(element);

		editor.isVoid = (element) => (isLatexElement(element as IBaseElement) ? true : isVoid(element));

		editor.insertBreak = () => {
			if (!editor.selection || !Range.isCollapsed(editor.selection)) {
				insertBreak();
			} else {
				if (Editor.isVoid(editor, Node.get(editor, Path.parent(editor.selection.anchor.path)))) {
					Editor.insertNode(editor, {
						type: 'paragraph',
						children: [{ text: '' }]
					} as any);
				} else {
					insertBreak();
				}
			}
		};

		return editor;
	}

	export function insertLatex(editor: Editor, latex: string, inline: boolean, at?: Location) {
		const node = { type: 'latex', latex, inline, children: [{ text: '' }] };
		if (inline) {
			Editor.withoutNormalizing(editor, () => {
				Transforms.insertNodes(editor, node, { at });
			});
		} else {
			Transforms.insertNodes(editor, node, { at });
		}
	}
</script>

<script lang="ts">
	import {
		isReadOnly,
		findPath,
		getEditor,
		getSelectedContext,
		getFocusedContext,
		getReadOnlyContext,
		type ISvelteEditor
	} from 'svelte-slate';
	import { Editor, Location, Range, Node, Path, Transforms } from 'slate';
	import katex from 'katex';
	import LatexEditor from './LatexEditor.svelte';
	export let element: ILatexElement;
	export let isInline: boolean;
	export let isVoid: boolean;
	export let contenteditable: boolean;
	export let ref: HTMLElement = undefined;
	export let dir: 'rtl' | 'ltr' = undefined;

	const editor = getEditor();
	const selectedContext = getSelectedContext();
	const focusedContext = getFocusedContext();
	const readOnlyContext = getReadOnlyContext();

	$: selected = $readOnlyContext ? false : $selectedContext && $focusedContext;
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
			const node = { type: 'latex', latex, inline, children: [{ text: '' }] };
			if (inline) {
				Transforms.insertNodes(
					editor,
					{
						type: 'paragraph',
						children: [node]
					} as any,
					{ at: path }
				);
			} else {
				Transforms.insertNodes(editor, node, { at: path.slice(0, -1) });
			}
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
	function onEdit(e: MouseEvent | TouchEvent) {
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
		}
	}
</script>

<LatexEditor bind:open bind:latex bind:inline {onDone} {onDelete} />

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
	<div class="latex-value" class:inline={currentInline} contenteditable={false} class:selected>
		<span bind:this={latexElement} />
		<div class="edit" class:selected>
			<button class="btn btn-sm btn-primary" on:mousedown={onEdit} on:touchstart={onEdit}
				><i class="bi bi-pencil" /></button
			>
		</div>
	</div>
	<slot />
</div>

<style>
	.inline {
		display: inline;
	}
	.latex-element {
		position: relative;
		margin: 0;
	}
	.latex-value {
		position: relative;
	}
	.latex-value.selected {
		box-shadow: 0 0 0 3px #333;
	}

	.edit {
		display: none;
		position: absolute;
		top: -2em;
		left: calc(50% - 1em);
		background-color: white;
	}
	.edit.selected {
		display: inline;
	}
</style>
