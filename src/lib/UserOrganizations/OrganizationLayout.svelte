<script lang="ts">
	import UserDropdown from '../UserDropdown.svelte';
	import { page } from '$app/stores';
	import { loading } from '$lib/state/loading';

	export let organizationId: number;
</script>

<div class="h-100">
	<div class="d-flex flex-row h-100">
		<div class="d-flex flex-column flex-shrink-0" aria-label="App navigation">
			<a type="button" class="logo btn btn-secondary" href="/"><strong>Quant[U]</strong></a>
			<a type="button" class="btn btn-primary" href="/user/organizations">
				Organizations <i class="bi bi-command" />
			</a>
			<a
				type="button"
				class="btn btn-primary"
				class:disabled={$page.path === `/user/organizations/${organizationId}/quizzes`}
				href={`/user/organizations/${organizationId}/quizzes`}
			>
				Quizzes <i class="bi bi-list" />
			</a>
			<a
				type="button"
				class="btn btn-primary"
				class:disabled={$page.path === `/user/organizations/${organizationId}/questions`}
				href={`/user/organizations/${organizationId}/questions`}
			>
				Questions <i class="bi bi-question" />
			</a>
			<div class="d-flex justify-content-center">
				{#if $loading}
					<span class="spinner-border spinner-border-lg" role="status" aria-hidden="true" />
				{/if}
			</div>
			<div class="w-100 mt-auto">
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
