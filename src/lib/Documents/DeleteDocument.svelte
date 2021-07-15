<script lang="ts">
	import type { IDocumentMeta } from '$lib/state/documents/documents';

	export let deleteDocument: IDocumentMeta;
	export let deleteDocumentText: string;
	export let onDeleteDocument: () => void;
</script>

<div
	class="modal fade"
	id="delete-document"
	tabindex="-1"
	aria-labelledby="delete-document-label"
	aria-hidden="true"
>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h5 id="delete-document-label" class="modal-title">Delete {deleteDocument?.name}</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				<div class="input-group mt-4">
					<input
						type="search"
						class="form-control"
						placeholder="Type delete to permanently remove."
						bind:value={deleteDocumentText}
					/>
				</div>
			</div>
			<div class="modal-footer">
				<button
					type="button"
					on:click={onDeleteDocument}
					disabled={deleteDocumentText.trim().toLowerCase() !== 'delete'}
					data-bs-dismiss="modal"
					class="btn btn-danger text-white">Delete</button
				>
				<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
			</div>
		</div>
	</div>
</div>
