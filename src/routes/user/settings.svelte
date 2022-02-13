<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import type { LoadInput } from '@sveltejs/kit';

	export async function load(input: LoadInput) {
		const response = authGuard(input);
		return response;
	}
</script>

<script lang="ts">
	import AppLayout from '$lib/components/AppLayout.svelte';
	import Settings from '$lib/components/Settings.svelte';
</script>

<svelte:head>
	<title>Settings</title>
</svelte:head>

<AppLayout>
	<Settings />
</AppLayout>
