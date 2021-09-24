<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let id: string;
	export let tags: string[];
	export let disabled = false;

	const dispatch = createEventDispatcher<{ change: string[] }>();

	let tag: string;

	function onAddTag() {
		if (tag && !tags.includes(tag)) {
			tags.push(tag);
			tag = '';
			dispatch('change', tags);
			tags = tags;
		}
	}
	function onKeyPress(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			onAddTag();
		}
	}
	function createOnDelete(tag: string) {
		return function onDelete() {
			const index = tags.indexOf(tag);
			if (index !== -1) {
				tags.splice(index, 1);
				dispatch('change', tags);
				tags = tags;
			}
		};
	}
</script>

<div class="d-flex flex-wrap">
	{#each tags as tag}
		<button type="button" {disabled} class="btn btn-primary me-2 mt-2">
			{tag}
			{#if !disabled}
				<span class="badge bg-danger" on:click={createOnDelete(tag)}><i class="bi bi-x" /></span>
			{/if}
		</button>
	{/each}
	{#if !disabled}
		<div class="d-inline mt-2">
			<div class="input-group">
				<input
					{id}
					type="text"
					class="form-control border-0"
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
	{/if}
</div>

<style lang="scss">
	input:focus {
		outline-width: 0 !important;
		outline: none !important;
		box-shadow: none !important;
	}
</style>
