<script lang="ts">
	import { BlockType } from '$lib/state/documents/blocks';
	import type { DocumentStore } from '$lib/state/documents/DocumentStore';

	export let documentStore: DocumentStore;

	let blockType: BlockType = BlockType.Text;

	function onCreateBlock() {
		documentStore.createBlock(blockType);
	}
</script>

<div class="d-flex align-items-center justify-content-center">
	<div class="flex-shrink-0">
		<div class="input-group">
			<select
				class="form-select"
				placeholder="New Block Type"
				aria-label="New Block Type"
				required
				bind:value={blockType}
			>
				{#each Object.entries(BlockType) as [key, value]}
					<option {value}>{key}</option>
				{/each}
			</select>
			<button
				type="submit"
				class="btn btn-primary"
				aria-label="Create Block"
				on:click={onCreateBlock}
			>
				<i class="bi bi-plus" />
			</button>
		</div>
	</div>
</div>
