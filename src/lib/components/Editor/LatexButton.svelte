<script lang="ts">
	import { getEditorContext } from 'svelte-slate';
	import Button from './Button.svelte';
	import { insertLatex } from './LatexElement.svelte';
	import { isBlockActive } from './utils';

	const editorContext = getEditorContext();
	$: editor = $editorContext;
	$: active = isBlockActive(editor, 'code');

	$: onClick = () => insertLatex(editor);
</script>

<Button {active} {onClick}>
	<i class="bi bi-plus-slash-minus" />
</Button>
