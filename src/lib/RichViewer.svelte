<script lang="ts" context="module">
	import 'quill/dist/quill.core.css';
	import '@aicacia/quill-rich-editor/styles/index.css';
</script>

<script lang="ts">
	import type Op from 'quill-delta/dist/Op';
	import type { renderOps } from '@aicacia/quill-rich-editor';
	import { onMount } from 'svelte';

	export let content: Op[];

	let prevContent: Op[];
	let element: HTMLDivElement;
	let renderOpsFn: typeof renderOps;

	$: if (element && renderOpsFn && prevContent !== content) {
		prevContent = content;
		renderOpsFn(element, content);
	}

	onMount(() => {
		import('@aicacia/quill-rich-editor').then(({ renderOps }) => {
			renderOpsFn = renderOps;
			renderOps(element, content);
		});
	});
</script>

<div bind:this={element} />
