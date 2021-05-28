<script lang="ts">
	import { Marked } from '@ts-stack/markdown';
	import { afterUpdate, onMount } from 'svelte';

	export let markdown: string;
	let element: HTMLDivElement;

	const MARKDOWN_OPTIONS = {
		delimiters: [
			{ left: '$$', right: '$$', display: true },
			{ left: '$', right: '$', display: false }
		],
		throwOnError: false
	};

	function renderKatex() {
		if (element) {
			(window as any).renderMathInElement(element, MARKDOWN_OPTIONS);
		}
	}

	onMount(renderKatex);
	afterUpdate(() => {
		renderKatex();
	});
</script>

<div class="markdown" bind:this={element}>
	{@html Marked.parse(markdown)}
</div>
