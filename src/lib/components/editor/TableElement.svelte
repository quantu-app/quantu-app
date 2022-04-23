<svelte:options immutable />

<script lang="ts" context="module">
	import type { IBaseElement, IElement } from './Element.svelte';

	export interface ITableElement extends IBaseElement {
		type: 'table';
		children: ITableElementElement[];
	}

	export function isTableElement(element: IBaseElement): element is ITableElement {
		return element.type === 'table';
	}

	export function withTables<T extends ISvelteEditor = ISvelteEditor>(editor: T): T {
		const { deleteBackward, deleteForward, insertBreak } = editor;

		editor.deleteBackward = (unit) => {
			const { selection } = editor;

			if (selection && Range.isCollapsed(selection)) {
				const [cell] = Editor.nodes(editor, {
					match: (n) =>
						!Editor.isEditor(n) && SlateElement.isElement(n) && n['type'] === 'table-cell'
				});

				if (cell) {
					const [, cellPath] = cell;
					const start = Editor.start(editor, cellPath);

					if (Point.equals(selection.anchor, start)) {
						return;
					}
				}
			}

			deleteBackward(unit);
		};

		editor.deleteForward = (unit) => {
			const { selection } = editor;

			if (selection && Range.isCollapsed(selection)) {
				const [cell] = Editor.nodes(editor, {
					match: (n) =>
						!Editor.isEditor(n) && SlateElement.isElement(n) && n['type'] === 'table-cell'
				});

				if (cell) {
					const [, cellPath] = cell;
					const end = Editor.end(editor, cellPath);

					if (Point.equals(selection.anchor, end)) {
						return;
					}
				}
			}

			deleteForward(unit);
		};

		editor.insertBreak = () => {
			const { selection } = editor;

			if (selection) {
				const [table] = Editor.nodes(editor, {
					match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n['type'] === 'table'
				});

				if (table) {
					return;
				}
			}

			insertBreak();
		};

		return editor;
	}

	export function insertTable(editor: Editor) {
		const table = {
			type: 'table',
			children: [
				{
					type: 'table-head',
					children: [
						{
							type: 'table-row',
							children: [
								{
									type: 'table-cell',
									children: [{ text: '' }]
								}
							]
						}
					]
				},
				{
					type: 'table-body',
					children: [
						{
							type: 'table-row',
							children: [
								{
									type: 'table-cell',
									children: [{ text: '' }]
								}
							]
						}
					]
				}
			]
		};
		Transforms.insertNodes(editor, table);
	}
</script>

<script lang="ts">
	import {
		createContext,
		ELEMENT_CONTEXT_KEY,
		findPath,
		getEditor,
		getFocusedContext,
		getReadOnlyContext,
		getSelectedContext
	} from 'svelte-slate';
	import type { ISvelteEditor } from 'svelte-slate';
	import { Editor, Transforms, Range, Point, Element as SlateElement } from 'slate';
	import TableElementElement, { type ITableElementElement } from './TableElementElement.svelte';

	export let element: ITableElement;
	export let isInline: boolean;
	export let isVoid: boolean;
	export let contenteditable: boolean;
	export let ref: HTMLElement = undefined;
	export let dir: 'rtl' | 'ltr' = undefined;

	const editor = getEditor();
	const selectedContext = getSelectedContext();
	const focusedContext = getFocusedContext();
	const readOnlyContext = getReadOnlyContext();

	createContext(ELEMENT_CONTEXT_KEY, TableElementElement);

	$: selected = $readOnlyContext ? false : $selectedContext && $focusedContext;
	$: path = findPath(element);
</script>

<table
	class="table table-striped table-bordered table-hover"
	class:selected
	bind:this={ref}
	data-slate-node="element"
	data-slate-inline={isInline}
	data-slate-void={isVoid}
	{dir}
	{contenteditable}
>
	<slot />
</table>

<style>
	.selected {
		box-shadow: 0 0 0 3px #333;
	}
</style>
