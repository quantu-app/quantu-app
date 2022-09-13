<script context="module" lang="ts">
	type ViewingOptions = {
		visible: boolean;
		releasedAt: string;
	};
</script>

<script lang="ts">
	import DateTimeInput from '$lib/components/ui/DateTimeInput.svelte';
	export let item: ViewingOptions;
	export let disabled: boolean;
</script>

<div class="row my-2">
	<div class="col-1">
		<label for="visible" class="form-label">Visible</label>
		<input
			class="form-check-input"
			type="checkbox"
			name="visible"
			bind:checked={item.visible}
			{disabled}
		/>
	</div>
	{#if item.visible}
		<div class="col-md">
			<label for="releasedAt" class="form-label">Release At</label>
			<DateTimeInput id="releasedAt" bind:date={item.releasedAt} {disabled} />
		</div>
	{/if}
</div>
