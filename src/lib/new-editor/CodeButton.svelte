<script lang="ts">
	import { getEditorContext } from 'svelte-slate';
	import Button from './Button.svelte';
	import { insertCode } from './CodeElement.svelte';
	import { isBlockActive } from './utils';

	const editorContext = getEditorContext();
	$: editor = $editorContext;
	$: active = isBlockActive(editor, 'code');

	$: onClick = () => insertCode(editor);
</script>

<Button {active} {onClick}>
	<i class="bi bi-code-square" />
</Button>
