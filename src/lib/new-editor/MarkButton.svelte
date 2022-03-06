<script lang="ts">
	import { getEditorContext } from 'svelte-slate';
	import Button from './Button.svelte';
	import { isMarkActive, toggleMark } from './utils';

	export let format: string;

	const editorContext = getEditorContext();
	$: editor = $editorContext;
	$: active = isMarkActive(editor, format);
	$: onClick = (event: MouseEvent) => {
		event.preventDefault();
		toggleMark(editor, format);
	};
</script>

<Button {active} {onClick}>
	<slot />
</Button>
