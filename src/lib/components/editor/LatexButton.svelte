<script lang="ts">
	import type { Location } from 'slate';

	import { getEditorContext } from 'svelte-slate';
	import Button from './Button.svelte';
	import LatexEditor from './LatexEditor.svelte';
	import { insertLatex } from './LatexElement.svelte';
	import { isBlockActive } from './utils';

	const editorContext = getEditorContext();
	$: editor = $editorContext;
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
</script>

<LatexEditor bind:open bind:latex bind:inline {onDone} />

<Button {active} {onClick}>
	<i class="bi bi-plus-slash-minus" />
</Button>
