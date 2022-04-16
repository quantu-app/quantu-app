<script lang="ts">
	import { getEditorContext } from 'svelte-slate';
	import Button from './Button.svelte';
	import { insertTable } from './TableElement.svelte';
	import { isBlockActive } from './utils';

	const editorContext = getEditorContext();
	$: editor = $editorContext;
	$: active = isBlockActive(editor, 'table');

	$: onClick = () => insertTable(editor);
</script>

<Button {active} {onClick}>
	<i class="bi bi-table" />
</Button>
