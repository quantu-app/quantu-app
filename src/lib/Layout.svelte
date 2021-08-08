<script lang="ts">
	import { loading } from './state/loading';
	import UserDropdown from './UserDropdown.svelte';
</script>

<div class="h-100">
	<div class="d-flex flex-row h-100">
		<div class="d-flex flex-column align-items-stretch flex-shrink-0" aria-label="App navigation">
			<a type="button" class="logo btn btn-secondary" href="/"><strong>Q[U]</strong></a>
			<a type="button" class="btn btn-primary" href="/user/organizations">
				<i class="bi bi-command" />
			</a>
			<div class="d-flex justify-content-center">
				{#if $loading}
					<span class="spinner-border spinner-border-lg" role="status" aria-hidden="true" />
				{/if}
			</div>
			<div class="d-flex mt-auto">
				<UserDropdown />
			</div>
		</div>
		<div class="d-flex flex-column flex-grow-1">
			<slot />
		</div>
	</div>
</div>

<style lang="scss">
	.logo {
		font-family: Poppins, sans-serif;
		font-size: 1.25rem;
		padding: 0;
	}
</style>
