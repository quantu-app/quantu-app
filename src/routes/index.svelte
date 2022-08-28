<script context="module" lang="ts">
	export function load(input: LoadInput): LoadOutput {
		const redirectPath = input.url.searchParams.get('redirectPath');

		return {
			props: {
				redirectPath
			}
		};
	}
</script>

<script lang="ts">
	import PublicLayout from '$lib/components/layouts/PublicLayout.svelte';
	import { currentUser, redirectPathWritable } from '$lib/state/user';
	import { get } from 'svelte/store';
	import { base } from '$app/paths';
	import type { LoadInput, LoadOutput } from '@sveltejs/kit/types/internal';
	import SEO from '$lib/components/SEO/index.svelte';

	export let redirectPath: string = undefined;

	if (redirectPath && !get(redirectPathWritable)) {
		redirectPathWritable.set(redirectPath);
	}

	const pageTitle = 'QUANTU | Where learning meets fun';
</script>

<SEO title={pageTitle} robotsDirectives={['all']} />

<PublicLayout>
	<div class="container-full-bg bg-dark py-5">
		<div class="container">
			<div class="row my-5 py-5 text-white">
				<div class="col-md-6">
					<div class="d-flex align-items-center h-100">
						<div class="col-12">
							<h1 class="display-5 fw-bold d-block">Master Mathematics.</h1>
							<p class="fs-4 py-3 d-block">
								Learn advanced mathematics using the best methods proven by learning science.
							</p>
							{#if $currentUser}
								<a
									type="button"
									role="button"
									class="btn btn-primary btn-lg"
									href={`${base}/challenges`}>Challenges</a
								>
							{:else}
								<button
									type="button"
									data-bs-toggle="modal"
									data-bs-target="#sign-in-up-modal"
									data-signup="true"
									class="btn btn-primary"
								>
									Get Started
								</button>
							{/if}
						</div>
					</div>
				</div>
				<div class="col-md-6 text-center">
					<img
						src="https://github.com/quantu-app/design-platform/raw/master/app/resources/homepage/vitruve-man2-davinci.png"
						alt="Vitruve Man by Davinci"
					/>
				</div>
			</div>
		</div>
	</div>
	<div class="container">
		<div class="row py-4 my-4">
			<div class="col-12 my-5">
				<h2 class="display-5 fw-bold text-center">Advanced Math Made Simple</h2>
			</div>
			<div class="col-md-4 offset-md-2 text-center">
				<img
					class="img-fluid mx-auto d-block "
					src="https://github.com/quantu-app/design-platform/raw/master/app/resources/homepage/hand-crafted.png"
					alt="Hand Crafted"
					width="50%"
				/>
				<h2 class="fw-bold mt-5">Hand-crafted to build mastery</h2>
				<p class="mb-5">
					Quantu uses state-of-the-art research in learning science to craft lessons that stick deep
					in your memory.
				</p>
			</div>
			<div class="col-md-4 text-center">
				<img
					class="img-fluid mx-auto d-block "
					src="https://github.com/quantu-app/design-platform/raw/master/app/resources/homepage/for-learners.png"
					alt="For Learners"
					width="50%"
				/>
				<h2 class="fw-bold mt-5">For learners by learners</h2>
				<p class="mb-5">
					Our community of volunteers design and develop lessons that make it easier for you to
					understand complex topics.
				</p>
			</div>
			<hr />
			<div class="col-12 pb-5 my-5">
				<h2 class="display-5 fw-bold">Build Expertise Easily</h2>
			</div>
			<div class="col-md-6 px-4 text-center">
				<img
					src="https://github.com/quantu-app/design-platform/raw/master/app/resources/homepage/decision_tree.png"
					alt="Decision Tree"
				/>
			</div>
			<div class="col-md-6 px-4">
				<h2 class="fw-bold">Make Math Stick</h2>
				<p class="mb-5">Learn advanced math concepts and anchor them deep in your memory.</p>

				<h2 class="fw-bold pt-4">Refine Your Skills</h2>
				<p class="mb-5">Develop your abilities in math through guided and interactive lessons.</p>

				<h2 class="fw-bold pt-4">Learn On Your Terms</h2>
				<p>Master any topic at your own pace, fast or slow, no deadlines, no pressure.</p>
			</div>
		</div>
		<hr class="my-5" />
		<div class="row py-4 my-4">
			<div class="col-md-6 d-flex align-items-center">
				<img
					src="https://github.com/quantu-app/design-platform/raw/master/app/resources/homepage/circle_and_line.png"
					alt="Circle and Line"
				/>
			</div>
			<div class="col-md-6 px-4">
				<h2 class="fw-bold">Become a Prodigy with Quantu</h2>
				<p class="py-3">Join and become a part of Quantu's community of lifelong-learners.</p>
				{#if !$currentUser}
					<button
						type="button"
						data-bs-toggle="modal"
						data-bs-target="#sign-in-up-modal"
						data-signup="true"
						class="btn btn-primary"
					>
						Get Started
					</button>
				{/if}
			</div>
		</div>
	</div>
</PublicLayout>
