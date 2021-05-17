<script lang="ts">
	import { Marked } from '@ts-stack/markdown';
	import { afterUpdate } from 'svelte';

	export let markdown: string;
	let prevMarkdown: string;
	let element: HTMLDivElement;

	const MARKDOWN_OPTIONS = {
		delimiters: [
			{ left: '$$', right: '$$', display: true },
			{ left: '$', right: '$', display: false }
		],
		throwOnError: false
	};

	afterUpdate(() => {
		if (element && prevMarkdown !== markdown) {
			prevMarkdown = markdown;
			(window as any).renderMathInElement(element, MARKDOWN_OPTIONS);
		}
	});
</script>

<div class="markdown" bind:this={element}>
	{@html Marked.parse(markdown)}
</div>
