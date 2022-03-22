<script lang="ts">
	import type { Location } from 'slate';

	import { getEditorContext } from 'svelte-slate';
	import Button from './Button.svelte';
	import LatexEditor from './LatexEditor.svelte';
	import { insertLatex } from './LatexElement.svelte';
	import { isBlockActive } from './utils';

	const editorContext = getEditorContext();
	$: editor = $editorContext;
	$: active = isBlockActive(editor, 'code');

	let at: Location;
	let open = false;
	function onClick() {
		at = editor.selection ? editor.selection.anchor || editor.selection.focus : undefined;
		open = !open;
	}
	function onDone(latex: string, inline: boolean) {
		insertLatex(editor, latex, inline, at);
	}
</script>

<Button {active} {onClick}>
	<i class="bi bi-plus-slash-minus" />
</Button>

<LatexEditor bind:open {onDone} />
