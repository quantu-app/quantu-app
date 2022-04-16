<svelte:options immutable />

<script lang="ts" context="module">
	import type { IBaseElement, IElement } from './Element.svelte';
	import type { IText } from './Leaf.svelte';

	export interface ITableHeadElement extends IBaseElement {
		type: 'table-head';
		children: Array<ITableRowElement>;
	}
	export function isTableHeadElement(element: IBaseElement): element is ITableRowElement {
		return element.type === 'table-head';
	}

	export interface ITableBodyElement extends IBaseElement {
		type: 'table-body';
		children: Array<ITableRowElement>;
	}
	export function isTableBodyElement(element: IBaseElement): element is ITableRowElement {
		return element.type === 'table-body';
	}

	export interface ITableRowElement extends IBaseElement {
		type: 'table-row';
		children: Array<ITableCellElement>;
	}
	export function isTableRowElement(element: IBaseElement): element is ITableRowElement {
		return element.type === 'table-row';
	}

	export interface ITableCellElement extends IBaseElement {
		type: 'table-cell';
		children: Array<IElement | IText>;
	}
	export function isTableCellElement(element: IBaseElement): element is ITableRowElement {
		return element.type === 'table-cell';
	}

	export type ITableElementElement =
		| ITableHeadElement
		| ITableBodyElement
		| ITableRowElement
		| ITableCellElement
		| IElement;
</script>

<script lang="ts">
	import Element from './Element.svelte';

	export let element: ITableElementElement;
	export let isInline: boolean;
	export let isVoid: boolean;
	export let contenteditable: boolean;
	export let ref: HTMLElement = undefined;
	export let dir: 'rtl' | 'ltr' = undefined;
</script>

{#if element.type === 'table-head'}<thead
		bind:this={ref}
		data-slate-node="element"
		data-slate-inline={isInline}
		data-slate-void={isVoid}
		{dir}
		{contenteditable}
	>
		<slot />
	</thead>{:else if element.type === 'table-body'}<tbody
		bind:this={ref}
		data-slate-node="element"
		data-slate-inline={isInline}
		data-slate-void={isVoid}
		{dir}
		{contenteditable}><slot /></tbody
	>{:else if element.type === 'table-row'}<tr
		bind:this={ref}
		data-slate-node="element"
		data-slate-inline={isInline}
		data-slate-void={isVoid}
		{dir}
		{contenteditable}><slot /></tr
	>{:else if element.type === 'table-cell'}<td
		bind:this={ref}
		data-slate-node="element"
		data-slate-inline={isInline}
		data-slate-void={isVoid}
		{dir}
		{contenteditable}><slot /></td
	>{:else}<Element bind:ref {isInline} {isVoid} {dir} {contenteditable} {element}><slot /></Element
	>{/if}
