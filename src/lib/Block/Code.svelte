<script context="module" lang="ts">
	function getLanguages(): string[] {
		return (window as any).hljs.listLanguages();
	}
</script>

<script lang="ts">
	import type { BookStore } from '$lib/state/books';
	import CodeEditor from '$lib/quill/CodeEditor.svelte';
	import { afterUpdate, onMount } from 'svelte';
	import { debounce } from '@aicacia/debounce';
	import type Delta from 'quill-delta';
	import type Quill from 'quill';
	import type { Text, UUID } from 'automerge';
	import { applyOpsToText } from '$lib/utils';
	import type { ICodeBlock } from '$lib/state/blocks';

	export let bookStore: BookStore;
	export let id: UUID;
	export let lang: string;
	export let text: Text;

	let prevText = text;

	let quill: Quill;
	let updating = false;

	function onQuill(q: Quill) {
		quill = q;
		if (text) quill.setText(text.toString(), 'silent');
	}

	function updateBlockText() {
		if (quill && updating) {
			const ops = quill.getContents().ops;
			bookStore.updateBlock<ICodeBlock>(id, (block) => {
				applyOpsToText(block.text, ops);
			});
			updating = false;
		}
	}

	const debouncedUpdateBlockText = debounce(updateBlockText, 5000);

	function onLangSelect() {
		bookStore.updateBlock<ICodeBlock>(id, (block) => {
			block.lang = lang;
		});
	}

	function onTextChange({
		detail: [_delta, _oldContents, source]
	}: CustomEvent<[delta: Delta, oldContents: Delta, source: string]>) {
		if (source === 'user') {
			updating = true;
			debouncedUpdateBlockText();
		}
	}

	afterUpdate(() => {
		if (quill && prevText !== text) {
			prevText = text;
			if (text) quill.setText(text.toString(), 'silent');
		}
	});

	onMount(() => updateBlockText);
</script>

<div class="d-flex align-items-start justify-content-start">
	<div class="flex-shrink-0">
		<div class="input-group">
			<select
				class="form-select"
				placeholder="Language"
				aria-label="Language"
				required
				bind:value={lang}
				on:select={onLangSelect}
			>
				{#each getLanguages() as value}
					<option {value}>{value}</option>
				{/each}
			</select>
		</div>
	</div>
</div>
<CodeEditor {lang} {onQuill} on:textchange={onTextChange} />
