<script lang="ts">
	import { base } from '$app/paths';
	import AppLayout from '$lib/AppLayout.svelte';
	import { currentUser } from '$lib/state/user';
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<AppLayout>
	<div class="container">
		<div class="row py-4 my-4">
			<div class="col-md-6 px-4 pb-4">
				<h1 class="fw-bold">Master Mathematics.</h1>
				<p>
					Learn using the best methods in learning science. Complete, enjoy, and become part of an
					open math education community for life-long learners, autodidacts, math, and science
					lovers.
				</p>
				{#if $currentUser}
					<a type="button" class="btn btn-primary" href={`${base}/challenges`}>Challenges</a>
				{:else}
					<button
						type="button"
						data-bs-toggle="modal"
						data-bs-target="#sign-in-up-modal"
						class="btn btn-primary"
					>
						Get Started
					</button>
				{/if}
			</div>
			<div class="col-md-6 px-4 text-center">
				<img
					src="https://github.com/quantu-app/design-platform/raw/master/app/resources/homepage/Golden-Ratio-Blocked.png"
					alt="Golden Ratio"
				/>
			</div>
		</div>
		<hr />
		<div class="row py-4 my-4">
			<div class="col-md-6 px-4">
				<h3 class="fw-bold">Master concepts through guided and interactive lessons</h3>
				<p>
					Content creators design and develop lessons so you can learn and master any topic at your
					own pace. Lessons are hand-crafted to build mastery and intuition.
				</p>
			</div>
			<div class="col-md-6 px-4 text-center">
				<img
					src="https://github.com/quantu-app/design-platform/raw/master/app/resources/homepage/circle_and_line.png"
					alt="Circle and Line"
				/>
			</div>
		</div>
		<hr />
		<div class="row py-4 my-4">
			<div class="col-md-6 px-4 text-center">
				<img
					src="https://github.com/quantu-app/design-platform/raw/master/app/resources/homepage/decision_tree.png"
					alt="Decision Tree"
				/>
			</div>
			<div class="col-md-6 px-4">
				<h3 class="fw-bold">Your blueprint for building intuition and expertise</h3>
				<p>
					We use state-of-the-art research in learning science to craft interactive, problem solving
					based approaches to learning, which anchor the concepts deep into your long-term memory
					building out your knowledge tree.
				</p>
				<h3 class="fw-bold">For everyone young and old alike</h3>
				<p>
					We believe learning advanced mathemetics can and should be a lifelong, community based,
					and most importantly, an enjoyable and rewarding experience. Whether you want to learn
					group theory or solve logic puzzles, our learning platform for advanced mathematics is
					designed with this in mind.
				</p>
			</div>
		</div>
	</div>
</AppLayout>
