<script context="module" lang="ts">
	import { Marked } from '@ts-stack/markdown';

	const MARKDOWN_OPTIONS = {
		delimiters: [
			{ left: '$$', right: '$$', display: true },
			{ left: '$', right: '$', display: false }
		],
		throwOnError: false
	};

	function highlight(code: string, language?: string): string {
		let html = '';

		try {
			html = (window as any).hljs.highlight(code, { language }).value;
		} catch (_error) {
			html = (window as any).hljs.highlightAuto(code).value;
		}

		return `<div style="background: #eaeaea">${html}</div>`;
	}

	Marked.setOptions({ highlight });
</script>

<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';

	export let markdown: string;
	let element: HTMLDivElement;

	function renderLatex() {
		if (element) {
			(window as any).renderMathInElement(element, MARKDOWN_OPTIONS);
		}
	}

	function afterRender() {
		renderLatex();
	}

	onMount(afterRender);
	afterUpdate(afterRender);
</script>

<div class="markdown" bind:this={element}>
	{@html Marked.parse(markdown)}
</div>
