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
	import { page } from '$app/stores';
	import { challengesByDepartmentUrl, showChallengeByUrl } from '$lib/state/challenges';
	import Challenge from '$lib/components/questions/Challenge.svelte';
	import { onMount } from 'svelte';
	import SEO from '$lib/components/SEO/index.svelte';

	export let departmentUrl: string;
	export let url: string;

	$: challenge = ($challengesByDepartmentUrl[departmentUrl] || {})[url];

	onMount(async () => {
		await showChallengeByUrl(departmentUrl, url);
	});
</script>

{#if challenge}
	<SEO
		title={challenge.name}
		openGraph={{
			title: challenge.name,
			url: $page.url.toString(),
			type: 'website'
		}}
		twitter={{
			title: challenge.name,
			card: 'summary'
		}}
		robotsDirectives={['all']}
	/>
{/if}

<UserLayout>
	<div id="challenge-wrapper">
		<nav id="challenge-sidebar">
			<div class="challenge-sidebar-header">
				<h5 class="mt-4 mb-0 ms-4 department-heading">Department</h5>
				{#if challenge}
					<h5 class="ms-4 department">{challenge.department.name}</h5>
				{/if}
			</div>
		</nav>
		<div id="challenge-content">
			{#if challenge}
				<div class="row mt-3 mx-0">
					<div class="col-lg-12">
						<h2>{challenge.name}</h2>
					</div>
					<div class="col-lg-12">
						<Challenge {challenge}>
							<a
								slot="extra"
								role="button"
								class="btn btn-primary"
								href={`${base}/challenges/${departmentUrl}/${url}/review`}
							>
								Review
							</a>
						</Challenge>
					</div>
				</div>
			{/if}
		</div>
		<div id="challenge-menu" />
	</div>
</UserLayout>

<style type="css">
	#challenge-wrapper {
		display: flex;
		width: 100%;
		align-items: stretch;
	}
	#challenge-sidebar {
		min-width: 270px;
		max-width: 270px;
		border-right: 1px solid #707070;
		background: white;
		z-index: 1;
	}
	#challenge-menu {
		z-index: 1;
	}
	#challenge-content {
		width: 100%;
		max-width: 800px;
		min-height: 100vh;
		border-right: 1px solid #707070;
	}
	h5.department-heading {
		color: black;
		font-weight: bold;
		font-size: 18px;
	}
	h5.department {
		font-weight: 500;
		color: #999999;
		font-size: 18px;
	}
</style>
