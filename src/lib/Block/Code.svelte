<script lang="ts">
	import type { DocumentStore } from '$lib/state/documents/DocumentStore';
	import CodeEditor from '$lib/quill/CodeEditor.svelte';
	import { afterUpdate, onMount } from 'svelte';
	import { debounce } from '@aicacia/debounce';
	import type Delta from 'quill-delta';
	import type Quill from 'quill';
	import type { Text, UUID } from 'automerge';
	import { applyOpsToText } from '$lib/utils';
	import type { ICodeBlock } from '$lib/state/documents/blocks';

	export let documentStore: DocumentStore;
	export let id: UUID;
	export let language: string;
	export let text: Text;

	let prevText = text;

	let quill: Quill;
	let updating = false;

	function getLanguages(): string[] {
		return window.hljs.listLanguages();
	}

	function onQuill(q: Quill) {
		quill = q;
		if (text) quill.setText(text.toString(), 'silent');
	}

	function updateBlockText() {
		if (quill && updating) {
			const ops = quill.getContents().ops;
			documentStore.updateBlock<ICodeBlock>(id, (block) => {
				applyOpsToText(block.text, ops);
			});
			updating = false;
		}
	}

	const debouncedUpdateBlockText = debounce(updateBlockText, 5000);

	function onLangSelect() {
		documentStore.updateBlock<ICodeBlock>(id, (block) => {
			block.language = language;
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
				bind:value={language}
				on:select={onLangSelect}
			>
				{#each getLanguages() as value}
					<option {value}>{value}</option>
				{/each}
			</select>
		</div>
	</div>
</div>
<CodeEditor {language} {onQuill} on:textchange={onTextChange} />
