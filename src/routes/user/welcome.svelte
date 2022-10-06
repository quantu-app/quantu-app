<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import { isValidStatus } from '$lib/guard/isValidStatus';

	export const load: Load = async (input) => {
		const response = await authGuard(input);

		if (!isValidStatus(response)) {
			return response;
		}

		// if a logged-in and confirmed user tries to access this page
		// then we should redirect them to the default app dashboard / homepage
		let confirmed = input.session.user?.confirmed;

		if (confirmed) {
			return {
				status: 302,
				redirect: challengesPath()
			};
		}
	};
</script>

<script lang="ts">
	import UserLayout from '$lib/components/layouts/UserLayout.svelte';
	import { currentUser } from '$lib/state/user';
	import Welcome from '$lib/components/user/Welcome.svelte';
	import type { Load } from '@sveltejs/kit';
	import { session } from '$app/stores';
	import { challengesPath } from '$lib/routingUtils';
</script>

<svelte:head>
	<title>Welcome</title>
</svelte:head>

<UserLayout>
	<div class="container mb-8">
		<Welcome user={$currentUser} />
	</div>
</UserLayout>
