<script lang="ts">
	import { getEditorContext } from 'svelte-slate/components/Slate.svelte';
	import Button from './Button.svelte';
	import isUrl from 'is-url';
	import { insertImage } from 'svelte-slate/plugins/ImageElement.svelte';
	import Modal from '../ui/Modal.svelte';

	const editorContext = getEditorContext();
	$: editor = $editorContext;

	let url: string;
	let entering = false;

	function onMouseDown() {
		entering = true;
	}
	function onEnter() {
		if (isUrl(url)) {
			insertImage(editor, url);
			url = '';
			entering = false;
		}
	}
</script>

<Button {onMouseDown}>
	<i class="bi bi-image" />
</Button>

<Modal bind:open={entering}>
	<div class="input-group">
		<input
			type="text"
			class="form-control"
			id="editor-image-url"
			placeholder="Image URL"
			bind:value={url}
		/>
		<Button active={!isUrl(url)} onMouseDown={onEnter}><i class="bi bi-check" /></Button>
	</div>
</Modal>
