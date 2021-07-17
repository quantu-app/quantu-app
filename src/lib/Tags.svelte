<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let id: string;
	export let tags: string[];

	const dispatch = createEventDispatcher<{ change: string[] }>();

	$: currentTags = [...tags];
	let tag: string;

	function onAddTag() {
		if (tag && !tags.includes(tag)) {
			currentTags = [...currentTags, tag];
			tag = '';
			dispatch('change', currentTags);
		}
	}
	function onKeyPress(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			onAddTag();
		}
	}
	function createOnDelete(tag: string) {
		return function onDelete() {
			const index = currentTags.indexOf(tag);
			if (index !== -1) {
				currentTags = [...currentTags];
				currentTags.splice(index, 1);
				dispatch('change', currentTags);
			}
		};
	}
</script>

<div class="d-flex flex-wrap">
	{#each currentTags as tag}
		<button type="button" class="btn btn-primary mt-2 me-2">
			{tag}
			<span class="badge bg-danger" on:click={createOnDelete(tag)}><i class="bi bi-x" /></span>
		</button>
	{/each}
	<div class="d-inline mt-2">
		<div class="input-group">
			<input
				{id}
				type="text"
				class="form-control"
				placeholder="Enter a tag"
				bind:value={tag}
				on:keypress={onKeyPress}
			/>
			<button
				type="submit"
				disabled={!tag}
				class="btn btn-primary"
				aria-label="Add Tag"
				on:click={onAddTag}
			>
				<i class="bi bi-plus" />
			</button>
		</div>
	</div>
</div>
