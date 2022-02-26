<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import { browser } from '$app/env';

	/** @type {import('@sveltejs/kit').Load} */
	export async function load(input) {
		return authGuard(input);
	}
</script>

<script lang="ts">
	import AppLayout from '$lib/components/AppLayout.svelte';
	import { base } from '$app/paths';
	import type { Challenge, Topic } from '@prisma/client';
	import Challenges from '$lib/components/challenges/Challenges.svelte';

	let challenges: Array<Challenge & { topic: Topic }> = [];

	if (browser) {
		fetch(`${base}/api/challenges`)
			.then((res) => res.json())
			.then((data) => {
				challenges = data;
			});
	}
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
