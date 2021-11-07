<script context="module" lang="ts">
	import type { LoadInput } from '@sveltejs/kit';

	export function load({ page, session }: LoadInput) {
		const redirectPathString = page.query.get('redirectPath'),
			redirectPath = redirectPathString ? decodeURIComponent(redirectPathString) : undefined;

		if (session) {
			return {
				status: 302,
				redirect: '/quizzes'
			};
		} else {
			return {
				props: {
					redirectPath
				}
			};
		}
	}
</script>

<script lang="ts">
	import AppLayout from '$lib/AppLayout.svelte';
	import { currentUser, redirectPathWritable } from '$lib/state/user';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';

	export let redirectPath: string;

	$: if (browser && $currentUser && !redirectPath) {
		goto('/quizzes');
	}

	onMount(() => {
		if (redirectPath) {
			redirectPathWritable.set(redirectPath);
		}
		return () => redirectPathWritable.set(undefined);
	});
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<AppLayout>
	<div class="d-flex justify-content-center align-items-center h-100">
		<div class="d-flex flex-column align-items-center">
			<h1>Quant[U]</h1>

			<div class="d-flex">
				<button
					type="button"
					data-bs-toggle="modal"
					data-bs-target="#sign-in-up-modal"
					class="btn btn-primary"
				>
					Sign in/up
				</button>
			</div>
		</div>
	</div>
</AppLayout>
