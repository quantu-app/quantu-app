<script lang="ts">
	import { getEditorContext } from 'svelte-slate';
	import Button from './Button.svelte';
	import LatexEditor from './LatexEditor.svelte';
	import { insertLatex } from './LatexElement.svelte';
	import { isBlockActive } from './utils';

	const editorContext = getEditorContext();
	$: editor = $editorContext;
	$: active = isBlockActive(editor, 'code');

	let open = false;
	function onClick() {
		open = !open;
	}
	function onDone(latex: string, inline: boolean) {
		insertLatex(editor, latex, inline);
	}
</script>

<Button {active} {onClick}>
	<i class="bi bi-plus-slash-minus" />
</Button>

<LatexEditor bind:open {onDone} />
