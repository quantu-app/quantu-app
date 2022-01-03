<script lang="ts">
	import UserDropdown from './UserDropdown.svelte';
</script>

<nav class="px-4 py-2 bg-dark">
	<div class="d-flex justify-content-between px-4">
		<div>
			<a class="btn btn-light logo" href="/">[Q]</a>
		</div>
		<div>
			<UserDropdown />
		</div>
	</div>
</nav>

<style lang="scss">
	.logo {
		border-radius: 100%;
		padding: 0.375rem 0.25rem;
	}
</style>
