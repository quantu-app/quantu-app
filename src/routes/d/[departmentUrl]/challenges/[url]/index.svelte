<script context="module" lang="ts">
	import { authGuard } from '$lib/guard/authGuard';
	import { isValidStatus } from '$lib/guard/isValidStatus';
	import type { LoadInput } from '@sveltejs/kit/types/internal';

	export async function load(input: LoadInput) {
		const response = authGuard(input);

		if (!isValidStatus(response)) {
			return response;
		}

		return {
			props: {
				departmentUrl: input.params.departmentUrl,
				url: input.params.url
			}
		};
	}
</script>

<script lang="ts">
	import UserLayout from '$lib/components/layouts/UserLayout.svelte';
	import { base } from '$app/paths';
	import { challengesByDepartmentUrl, showChallengeByUrl } from '$lib/state/challenges';
	import Challenge from '$lib/components/questions/Challenge.svelte';
	import { onMount } from 'svelte';
	import SEO from '$lib/components/SEO/index.svelte';

	export let departmentUrl: string;
	export let url: string;

	let titlePrefix: string = '[Q] Challenges | ';

	$: challenge = ($challengesByDepartmentUrl[departmentUrl] || {})[url];

	onMount(async () => {
		await showChallengeByUrl(departmentUrl, url);
	});
</script>

{#if challenge}
	<SEO title={titlePrefix + challenge.name} />
{/if}

<UserLayout>
	<div class="container-xxl">
		{#if challenge}
			<Challenge {challenge}>
				<a
					slot="extra"
					role="button"
					class="btn btn-primary"
					href={`${base}/d/${departmentUrl}/challenges/${url}/review`}
				>
					Review
				</a>
			</Challenge>
		{/if}
	</div>
</UserLayout>
