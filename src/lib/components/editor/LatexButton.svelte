<script lang="ts">
	import type { Location } from 'slate';
	import { onMount } from 'svelte';
	import { getEditorContext, getFocusedContext, isHotkey } from 'svelte-slate';
	import Button from './Button.svelte';
	import LatexEditor from './LatexEditor.svelte';
	import { insertLatex } from './LatexElement.svelte';
	import { isBlockActive } from './utils';

	const editorContext = getEditorContext();
	const focusedContext = getFocusedContext();

	$: editor = $editorContext;
	$: focused = $focusedContext;
	$: active = isBlockActive(editor, 'latex');

	let at: Location;
	let open = false;
	let latex = '';
	let inline = true;
	function onClick() {
		at = editor.selection ? editor.selection.anchor || editor.selection.focus : undefined;
		latex = '';
		inline = true;
		open = !open;
	}
	function onDone(latex: string, inline: boolean) {
		insertLatex(editor, latex, inline, at);
	}

	function onKeyDown(event: KeyboardEvent) {
		if (isHotkey('ctrl+m', event)) {
			event.preventDefault();

			if (focused) {
				latex = '';
				inline = true;
				open = true;
			} else {
				open = false;
			}
		}
	}

	onMount(() => {
		document.body.addEventListener('keydown', onKeyDown);

		return () => {
			document.body.removeEventListener('keydown', onKeyDown);
		};
	});
</script>

<LatexEditor bind:open bind:latex bind:inline {onDone} />

<Button {active} {onClick}>
	<i class="bi bi-plus-slash-minus" />
</Button>
