<script lang="ts">
	import { getEditorContext } from 'svelte-slate/components/Slate.svelte';
	import Button from './Button.svelte';
	import { insertCode } from 'svelte-slate/plugins/CodeElement.svelte';
	import { isBlockActive } from 'svelte-slate/plugins/utils';

	const editorContext = getEditorContext();
	$: editor = $editorContext;
	$: active = isBlockActive(editor, 'code');

	$: onMouseDown = () => !active && insertCode(editor);
</script>

<Button {active} {onMouseDown}>
	<i class="bi bi-code-square" />
</Button>
