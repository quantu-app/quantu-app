<script context="module" lang="ts">
	import type { LoadInput, Page } from '@sveltejs/kit';

	export function load(input: LoadInput) {
		const redirectPathString = input.page.query.get('redirectPath'),
			redirectPath = redirectPathString ? decodeURIComponent(redirectPathString) : undefined;

		return {
			props: {
				redirectPath
			}
		};
	}
</script>

<script lang="ts">
	import AppLayout from '$lib/AppLayout.svelte';
	import { currentUser, redirectPathWritable } from '$lib/state/user';
	import { onMount } from 'svelte';

	export let redirectPath: string;

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

			{#if $currentUser}
				<div class="d-flex">
					<a role="button" class="btn btn-primary me-1" href="/quizzes">Quizzes</a>
					<a role="button" class="btn btn-primary ms-1" href="/questions">Questions</a>
				</div>
			{:else}
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
			{/if}
		</div>
	</div>
</AppLayout>
