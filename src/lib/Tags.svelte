<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let id: string;
	export let tags: string[];
	export let loading = false;
	export let disabled = false;

	const dispatch = createEventDispatcher<{ change: string[] }>();

	let input: HTMLInputElement;
	let tag: string;

	$: onAddTag = () => {
		if (loading) {
			return;
		}
		if (tag && !tags.includes(tag)) {
			tags.push(tag);
			tag = '';
			dispatch('change', tags);
			tags = tags;
			input?.select();
		}
	};
	$: onKeyPress = (e: KeyboardEvent) => {
		if (loading) {
			return;
		}
		if (e.key === 'Enter') {
			onAddTag();
		}
	};
	$: createOnDelete = (tag: string) => {
		return function onDelete() {
			if (loading) {
				return;
			}
			const index = tags.indexOf(tag);
			if (index !== -1) {
				tags.splice(index, 1);
				dispatch('change', tags);
				tags = tags;
				tag = '';
				input?.select();
			}
		};
	};
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
					bind:this={input}
					bind:value={tag}
					on:keypress={onKeyPress}
				/>
				<button
					type="submit"
					disabled={!tag || loading}
					class="btn btn-primary"
					aria-label="Add Tag"
					on:click={onAddTag}
				>
					{#if loading}
						<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
					{/if}
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
