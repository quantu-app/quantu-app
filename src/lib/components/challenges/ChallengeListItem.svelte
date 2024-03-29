<svelte:options immutable />

<script lang="ts" context="module">
	import { departmentChallengePath, departmentChallengeReviewPath } from '$lib/routingUtils';
	const IMAGES = [
		'https://raw.githubusercontent.com/quantu-app/design-platform/c8023510d3491c97da21e0a5dc167456573ee4ac/app/resources/challenges/no_image_placeholder_imgs/Parallelogram.png',
		'https://raw.githubusercontent.com/quantu-app/design-platform/master/app/resources/challenges/no_image_placeholder_imgs/Three%20octogons.png',
		'https://raw.githubusercontent.com/quantu-app/design-platform/master/app/resources/challenges/no_image_placeholder_imgs/Two%20Hexagons.png',
		'https://github.com/quantu-app/design-platform/raw/master/app/resources/challenges/no_image_placeholder_imgs/Two%20Triangles.png',
		'https://github.com/quantu-app/design-platform/raw/master/app/resources/challenges/no_image_placeholder_imgs/Single%20Triangle%20Touching%20Edges.png',
		'https://raw.githubusercontent.com/quantu-app/design-platform/c8023510d3491c97da21e0a5dc167456573ee4ac/app/resources/challenges/no_image_placeholder_imgs/Parallelogram%20Blue%20Tilt.png'
	];
	const TODAY: Date = new Date();
</script>

<script lang="ts">
	import { base } from '$app/paths';
	import type { StateChallenge } from '$lib/state/challenges';
	import { XorShiftRng } from '@aicacia/rand';
	import { formatDistanceToNowStrict, isBefore, isSameDay } from 'date-fns';
	import { apiAssetPath } from '$lib/routingUtils';

	export let challenge: StateChallenge;

	const rng = XorShiftRng.fromSeed(new Date(challenge.createdAt).getTime());
	const image = rng.fromArray(IMAGES).unwrap();
</script>

<div class={challenge.result ? 'card solved' : 'card'}>
	<img
		src={challenge.logoId ? apiAssetPath(challenge.logoId) : image}
		alt={challenge.name}
		class="card-img-top"
	/>
	<div class="card-body">
		<h5 class="card-title mt-4 mt-lg-0 mb-0">{challenge.name}</h5>
		<div class="text-end">
			{#if challenge.result}
				<!-- svelte-ignore a11y-missing-content -->
				<a
					role="button"
					aria-label="review"
					class="text-success stretched-link"
					href={departmentChallengeReviewPath(challenge.department.url, challenge.url)}
				/>
			{:else}
				<!-- svelte-ignore a11y-missing-content -->
				<a
					role="button"
					aria-label="solve"
					class="stretched-link"
					href={departmentChallengePath(challenge.department.url, challenge.url)}
				/>
			{/if}
		</div>
	</div>
	<div class="card-footer">
		<div class="text-muted card-footer-info">
			<span class="text-uppercase">{challenge.department.name}</span><br />
			<span
				>{challenge.answers.length === 1 ? `1 Solver` : `${challenge.answers.length} Solvers`}
			</span>
			<span class="releasedAt">
				<span class="dot-block" />{formatDistanceToNowStrict(challenge.releasedAt, {
					addSuffix: false
				})}
				{#if !isSameDay(challenge.releasedAt, TODAY) && isBefore(challenge.releasedAt, TODAY)}
					ago
				{/if}
			</span>
			{#if challenge.result}
				<i class="bi fs-4 bi-check-circle-fill text-success solved-check" />
			{/if}
		</div>
	</div>
</div>

<style>
	.card {
		height: 300px;
		transition: all 0.2s ease;
		cursor: pointer;
	}
	.card:hover {
		box-shadow: 2px 3px 3px 1px #e0e0e0;
		transform: scale(1.02);
	}
	.card-footer {
		background-color: white;
		border: none;
	}
	.card-footer-info {
		font-size: 13px;
	}
	.solved-check {
		position: absolute;
		right: 15px;
		bottom: 0px;
	}

	.dot-block:after {
		content: '•';
		margin: 0 4px;
	}
</style>
