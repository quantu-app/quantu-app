<script lang="ts">
	import type { IBookMeta } from '$lib/state/books';

	export let id: string;
	export let book: IBookMeta;
	export let onDelete: () => void;

	$: createdAt = new Date(book.createdAt || '');
	$: updatedAt = new Date(book.updatedAt || '');
</script>

<tr>
	<th scope="row">{book.name}</th>
	<td>{createdAt.toLocaleTimeString()} {createdAt.toLocaleDateString()}</td>
	<td>{updatedAt.toLocaleTimeString()} {updatedAt.toLocaleDateString()}</td>
	<td>{book.wordCount || 0}</td>
	<td>{(book.tags || []).join(', ')}</td>
	<td>{(book.language || '').toUpperCase()}</td>
	<td>
		<div class="btn-group" role="group">
			<a type="button" class="btn btn-primary" aria-label="Edit" href={`/books/${id}`}
				><i class="bi bi-pencil" /></a
			>
			<button
				type="button"
				class="btn btn-danger text-white"
				data-bs-toggle="modal"
				data-bs-target="#delete-book"
				aria-label="Delete"
				on:click={onDelete}><i class="bi bi-trash" /></button
			>
		</div>
	</td>
</tr>
