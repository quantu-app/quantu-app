<script lang="ts">
	import type { IBookMeta } from '$lib/state/books';

	export let deleteBook: IBookMeta;
	export let deleteBookText: string;
	export let onDeleteBook: () => void;
</script>

<div
	class="modal fade"
	id="delete-book"
	tabindex="-1"
	aria-labelledby="delete-book-label"
	aria-hidden="true"
>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h5 id="delete-book-label" class="modal-title">Delete {deleteBook?.name}</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				<div class="input-group mt-4">
					<input
						type="search"
						class="form-control"
						placeholder="Type delete to permanently remove."
						bind:value={deleteBookText}
					/>
				</div>
			</div>
			<div class="modal-footer">
				<button
					type="button"
					on:click={onDeleteBook}
					disabled={deleteBookText.trim().toLowerCase() !== 'delete'}
					data-bs-dismiss="modal"
					class="btn btn-danger text-white">Delete</button
				>
				<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
			</div>
		</div>
	</div>
</div>
