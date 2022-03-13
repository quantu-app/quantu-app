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

	export let redirectPath: string = undefined;

	if (redirectPath && !get(redirectPathWritable)) {
		redirectPathWritable.set(redirectPath);
	}
</script>

<svelte:head>
	<title>QUANTU | Where learning meets fun</title>
</svelte:head>

<PublicLayout>
	<div class="container">
		<div class="row py-4 my-4">
			<div class="col-md-6 px-4 pb-4">
				<h1 class="fw-bold">Master Mathematics.</h1>
				<p>
					Learn using the best methods in learning science. Complete, enjoy, and become part of an
					open education community for life-long learners, autodidacts and math &amp; science
					lovers.
				</p>
				{#if $currentUser}
					<a type="button" role="button" class="btn btn-primary" href={`${base}/challenges`}
						>Challenges</a
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
			<div class="col-md-6 px-4 text-center">
				<img
					src="https://github.com/quantu-app/design-platform/raw/master/app/resources/homepage/law-of-large-numbers.png"
					alt="The Law of Large Numbers"
				/>
			</div>
		</div>
		<hr />
		<div class="row py-4 my-4">
			<div class="col-md-6 px-4 text-center">
				<img
					src="https://github.com/quantu-app/design-platform/raw/master/app/resources/homepage/circle_and_line.png"
					alt="Circle and Line"
				/>
			</div>
			<div class="col-md-6 px-4">
				<h3 class="fw-bold">Learn concepts through guided and interactive lessons</h3>
				<p>
					Content creators design and develop lessons so you can learn and master any department at
					your own pace. Lessons are hand-crafted to build mastery and intuition.
				</p>
			</div>
		</div>
		<hr />
		<div class="row py-4 my-4">
			<div class="col-md-6 px-4">
				<h3 class="fw-bold">Your blueprint for building intuition and expertise</h3>
				<p>
					We use state-of-the-art research in learning science to craft interactive, problem solving
					based approaches to learning, which anchor the concepts deep into your long-term memory
					building out your knowledge tree.
				</p>
				<h3 class="fw-bold pt-4">For everyone young and old alike</h3>
				<p>
					We believe learning advanced science &amp; mathemetics can and should be lifelong,
					community based, and most importantly, an enjoyable and rewarding experience. Whether you
					want to learn group theory, classical mechanics or just solve logic puzzles and compete
					with other autodidacts, our educational platform for quantitative learning is designed
					with you in mind.
				</p>
			</div>
			<div class="col-md-6 px-4 text-center">
				<img
					src="https://github.com/quantu-app/design-platform/raw/master/app/resources/homepage/decision_tree.png"
					alt="Decision Tree"
				/>
			</div>
		</div>
	</div>
</PublicLayout>
