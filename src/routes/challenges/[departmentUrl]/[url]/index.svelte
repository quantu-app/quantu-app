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
	import Department from '$lib/components/creator/departments/Department.svelte';

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
	<div id="challenge--container" class="container-fluid flex-grow-1">
		<div class="row min-vh-100">
			<div id="challenge--sidebar" class="col-auto px-sm-2 px-0">
				<div class="d-flex flex-column mt-3" id="challenge--sidebarContent">
					<ul class="nav nav-pills flex-column align-items-center align-items-sm-start">
						<li class="nav-item mx-3">
							{#if challenge && challenge.department}
								<a
									href="/challenges"
									class="nav-link align-middle px-0 py-0"
									alt={challenge.department.name}
								>
									<i class="fs-4 bi-building d-sm-none" />
									<span id="challenge--departmentHeading" class="d-none d-sm-block">Department</span
									>
									<span id="challenge--department" class="d-none d-sm-inline"
										>{challenge.department.name}</span
									>
								</a>
							{/if}
						</li>
					</ul>
				</div>
			</div>
			<div id="challenge--mainContent" class="col">
				{#if challenge}
					<div id="challenge-content" data-challenge-id={challenge.id}>
						<div class="row mt-3 mx-2">
							<div class="col-xl-8 col-12">
								<h2>{challenge.name}</h2>
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
					</div>
				{/if}
			</div>
		</div>
	</div>
</UserLayout>

<style type="css">
	#challenge--sidebar {
		border-right: 1px solid #707070;
	}
	#challenge--mainContent {
		min-height: 500px;
	}
	#challenge--departmentHeading {
		color: black;
		font-weight: bold;
		font-size: 18px;
	}
	#challenge--department {
		font-weight: 500;
		color: #999999;
		font-size: 18px;
	}
</style>
