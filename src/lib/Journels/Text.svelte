<script lang="ts">
	import RichEditor from '$lib/quill/RichEditor.svelte';
	import { afterUpdate, onMount } from 'svelte';
	import { debounce } from '@aicacia/debounce';
	import type Delta from 'quill-delta';
	import type Quill from 'quill';
	import type Op from 'quill-delta/dist/Op';
	import { updateJournel } from '$lib/state/journels';
	import { getWordCount } from '$lib/utils';

	export let localId: string;
	export let text: Op[];

	let prevText = text;

	let quill: Quill;
	let DeltaClass: typeof Delta;
	let updating = false;
	let initialized = false;

	$: if (!initialized && quill && DeltaClass) {
		initialized = true;
		quill.setContents(new DeltaClass(text), 'silent');
	}

	function onQuill(q: Quill) {
		quill = q;
	}

	function updateBlockText() {
		if (quill && updating) {
			updateJournel(localId, {
				content: quill.getContents().ops,
				wordCount: getWordCount(quill.getText())
			});
			updating = false;
		}
	}

	const debouncedUpdateBlockText = debounce(updateBlockText, 2000);

	function onTextChange({
		detail: [_delta, _oldContents, source]
	}: CustomEvent<[delta: Delta, oldContents: Delta, source: string]>) {
		if (source === 'user') {
			updating = true;
			debouncedUpdateBlockText();
		}
	}

	afterUpdate(() => {
		if (DeltaClass && quill && prevText !== text) {
			prevText = text;
			quill.setContents(new DeltaClass(text), 'silent');
		}
	});

	onMount(() => {
		import('quill-delta').then((module) => {
			DeltaClass = module.default;
		});

		return updateBlockText;
	});
</script>

<RichEditor {onQuill} on:textchange={onTextChange} />
