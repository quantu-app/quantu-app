<script lang="ts">
	import { isMarkActive, toggleMark } from 'svelte-slate/plugins/utils';
	import { getEditorContext } from 'svelte-slate';
	import Button from './Button.svelte';

	export let format: string;

	const editorContext = getEditorContext();
	$: editor = $editorContext;
	$: active = isMarkActive(editor, format);
	$: onMouseDown = (event: MouseEvent) => {
		event.preventDefault();
		toggleMark(editor, format);
	};
</script>

<Button {active} {onMouseDown}>
	<slot />
</Button>
