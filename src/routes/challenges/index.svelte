<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import type { LoadInput } from '@sveltejs/kit';
	import { browser } from '$app/env';
	import { isValidStatus } from '$lib/guard/isValidStatus';

	export async function load(input: LoadInput) {
		const response = authGuard(input);

		let challenges =
			!browser && isValidStatus(response)
				? await fetch(`${base}/api/challenges`).then((res) => res.json())
				: [];
		return {
			...response,
			props: {
				challenges
			}
		};
	}
</script>

<script lang="ts">
	import AppLayout from '$lib/components/AppLayout.svelte';
	import { base } from '$app/paths';
	import type { Challenge, Topic } from '@prisma/client';
	import Challenges from '$lib/components/challenges/Challenges.svelte';

	export let challenges: Array<Challenge & { topic: Topic }>;
</script>

<svelte:head>
	<title>Challenges</title>
</svelte:head>

<AppLayout
	breadcrumbs={[
		{ href: '/', title: 'Home' },
		{
			href: `/challenges`,
			title: 'Challenges'
		}
	]}
>
	<Challenges {challenges} />
</AppLayout>
