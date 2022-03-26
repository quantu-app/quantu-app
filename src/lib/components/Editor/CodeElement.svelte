<script lang="ts" context="module">
	import type { IBaseElement } from './Element.svelte';

	export interface ICodeElement extends IBaseElement {
		type: 'code';
		language: string;
	}

	export function isCodeElement(element: IBaseElement): element is ICodeElement {
		return element.type === 'code';
	}

	export function insertCode(editor: Editor) {
		const isActive = isBlockActive(editor, 'code');

		if (isActive) {
			Transforms.unwrapNodes(editor, {
				match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n['type'] === 'code',
				split: true
			});
		} else {
			const block = { type: 'code', language: 'js', children: [] };
			Transforms.wrapNodes(editor, block);
		}
	}

	function getLength(token: string | Token) {
		if (typeof token === 'string') {
			return token.length;
		} else if (typeof token.content === 'string') {
			return token.content.length;
		} else {
			return (token.content as Array<string | Token>).reduce((l, t) => l + getLength(t), 0);
		}
	}
</script>

<script lang="ts">
	import type { Token } from 'prismjs';
	import Prism from 'prismjs';
	import 'prismjs/components/prism-python.js';
	import 'prismjs/components/prism-php.js';
	import 'prismjs/components/prism-sql.js';
	import 'prismjs/components/prism-java.js';
	import 'prismjs/components/prism-typescript.js';
	import 'prismjs/components/prism-elixir.js';
	import 'prismjs/components/prism-css.js';
	import 'prismjs/components/prism-c.js';
	import 'prismjs/components/prism-cpp.js';
	import 'prismjs/components/prism-rust.js';
	import 'prismjs/components/prism-bash.js';
	import 'prismjs/components/prism-sass.js';
	import 'prismjs/components/prism-scala.js';
	import { DECORATE_CONTEXT_KEY, defaultDecorate } from 'svelte-slate';
	import type { NodeEntry } from 'slate';
	import { Editor, Transforms, Element as SlateElement, Text, Range } from 'slate';
	import { isBlockActive } from './utils';
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';

	export let element: ICodeElement;
	export let isInline: boolean;
	export let isVoid: boolean;
	export let contenteditable: boolean;
	export let ref: HTMLElement = undefined;
	export let dir: 'rtl' | 'ltr' = undefined;

	const decorateContext = writable(defaultDecorate);
	setContext(DECORATE_CONTEXT_KEY, decorateContext);

	let currentLanguage = element.language;
	$: if (currentLanguage !== element.language) {
		currentLanguage = element.language;
	}
	function decorate([node, path]: NodeEntry): Range[] {
		const ranges: Range[] = [];
		const lang = Prism.languages[currentLanguage];
		if (!Text.isText(node) || !lang) {
			return ranges;
		}
		const tokens = Prism.tokenize(node.text, lang);
		let start = 0;

		for (const token of tokens) {
			const length = getLength(token);
			const end = start + length;

			if (typeof token !== 'string') {
				ranges.push({
					[token.type]: true,
					anchor: { path, offset: start },
					focus: { path, offset: end }
				});
			}

			start = end;
		}

		return ranges;
	}
	decorateContext.set(decorate);
</script>

{#if isInline}<span
		bind:this={ref}
		data-slate-node="element"
		data-slate-inline={isInline}
		data-slate-void={isVoid}
		{dir}
		{contenteditable}><slot /></span
	>{:else}<div
		bind:this={ref}
		data-slate-node="element"
		data-slate-void={isVoid}
		{dir}
		{contenteditable}
	>
		<slot />
	</div>{/if}

<style>
	span,
	div {
		position: relative;
		font-family: monospace;
		background: #f1f1f1;
		padding: 0.25rem;
	}
</style>
