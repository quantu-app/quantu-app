<svelte:options immutable />

<script lang="ts">
	export let filter: string = '';
	export let placeholder = 'Filter...';
	export let onChange: (value: string) => void;
	export let searchIcon = false;
	export let searchInputClass: string = '';
	export let formClass: string = '';

	function internalOnChange(e: Event & { currentTarget: HTMLInputElement }) {
		onChange(e.currentTarget.value);
	}
</script>

<form on:submit|preventDefault class={formClass}>
	<div class="input-group" class:search-icon={searchIcon}>
		{#if searchIcon}
			<i class="bi bi-search" />
		{/if}
		<input
			type="text"
			class={`form-control ${searchInputClass || ''}`}
			{placeholder}
			bind:value={filter}
			on:change={internalOnChange}
		/>
	</div>
</form>

<style lang="scss">
	.input-group.search-icon .bi-search {
		position: relative;
		left: 27px;
		top: 9px;
		z-index: 10;
	}
	.input-group.search-icon .form-control {
		text-indent: 25px;
	}
</style>
