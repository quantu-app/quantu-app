<script lang="ts" context="module">
	const IMAGES = [
		'https://raw.githubusercontent.com/quantu-app/design-platform/c8023510d3491c97da21e0a5dc167456573ee4ac/app/resources/challenges/no_image_placeholder_imgs/Parallelogram.png',
		'https://raw.githubusercontent.com/quantu-app/design-platform/master/app/resources/challenges/no_image_placeholder_imgs/Three%20octogons.png',
		'https://raw.githubusercontent.com/quantu-app/design-platform/master/app/resources/challenges/no_image_placeholder_imgs/Two%20Hexagons.png',
		'https://github.com/quantu-app/design-platform/raw/master/app/resources/challenges/no_image_placeholder_imgs/Two%20Triangles.png',
		'https://github.com/quantu-app/design-platform/raw/master/app/resources/challenges/no_image_placeholder_imgs/Single%20Triangle%20Touching%20Edges.png',
		'https://raw.githubusercontent.com/quantu-app/design-platform/c8023510d3491c97da21e0a5dc167456573ee4ac/app/resources/challenges/no_image_placeholder_imgs/Parallelogram%20Blue%20Tilt.png'
	];
</script>

<script lang="ts">
	import { base } from '$app/paths';
	import type { StateChallenge } from '$lib/state/challenges';
	import { XorShiftRng } from '@aicacia/rand';
	import { compareAsc, formatDistanceToNowStrict, isBefore, isSameDay } from 'date-fns';

	export let challenge: StateChallenge;

	const rng = XorShiftRng.fromSeed(new Date(challenge.createdAt).getTime());
	const image = rng.fromArray(IMAGES).unwrap();
</script>

<div class={challenge.result ? 'card solved' : 'card'}>
	<img
		src={challenge.logoId ? `${base}/api/assets/${challenge.logoId}` : image}
		alt={challenge.name}
		class="card-img-top"
	/>
	<div class="card-body">
		<h5 class="card-title mt-4 mt-lg-0 mb-0">{challenge.name}</h5>
		<div class="text-end">
			{#if challenge.result}
				<a
					role="button"
					aria-label="review"
					class="text-success stretched-link"
					href={`${base}/challenges/${challenge.department.url}/${challenge.url}/review`}
				/>
			{:else}
				<a
					role="button"
					aria-label="solve"
					class="stretched-link"
					href={`${base}/challenges/${challenge.department.url}/${challenge.url}`}
				/>
			{/if}
		</div>
	</div>
	<div class="card-footer">
		<div class="text-muted card-footer-info">
			<span class="text-uppercase">{challenge.department.name}</span><br />
			<span>{challenge.solvers == 1 ? `1 Solver` : `${challenge.solvers} Solvers`} </span>
			<span class="releasedAt">
				<span class="dot-block" />{formatDistanceToNowStrict(new Date(challenge.releasedAt), {
					addSuffix: false
				})}
				{#if !isSameDay(challenge.releasedAt, new Date()) && isBefore(new Date(challenge.releasedAt), new Date())}
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
	.card.solved {
		border: 1px solid #42d12a;
	}
	.card.solved:hover {
		box-shadow: 2px 3px 3px 1px rgb(197, 228, 197);
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
