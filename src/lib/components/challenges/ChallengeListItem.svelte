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
	import { format } from 'date-fns';
	import RichViewer from '$lib/components/editor/RichViewer.svelte';

	export let challenge: StateChallenge;

	$: date = format(new Date(challenge.releasedAt || challenge.createdAt), 'PPPP');

	const rng = XorShiftRng.fromSeed(new Date(challenge.createdAt).getTime());
	const image = rng.fromArray(IMAGES).unwrap();
</script>

<div class="row my-4 px-4">
	<p class="text-center">{date}</p>
	<div class="challenge-card col-12 border p-4">
		<div class="row">
			<div class="col-lg-6 text-center">
				<img src={image} alt={challenge.name} class="img-fluid" />
			</div>
			<div class="col-lg-6">
				<h2 class="challenge-name mt-4 mt-lg-0">{challenge.name}</h2>
				<p class="challenge-description"><RichViewer value={challenge.description} /></p>
			</div>
		</div>
		<div class="row">
			<div class="col-6">
				<div class="text-muted mt-3">
					<span class="text-uppercase">{challenge.department.name}</span> |
					<span>{challenge.solvers == 1 ? `1 Solver` : `${challenge.solvers} Solvers`} </span>
				</div>
			</div>

			<div class="col-6 text-end">
				{#if challenge.result}
					<a
						role="button"
						class="btn btn-outline-primary"
						href={`${base}/challenges/${challenge.department.url}/${challenge.url}/review`}
						>Solved</a
					>
				{:else}
					<a
						role="button"
						class="btn btn-outline-primary"
						href={`${base}/challenges/${challenge.department.url}/${challenge.url}`}>Solve</a
					>
				{/if}
			</div>
		</div>
	</div>
	{#if challenge.result}
		<div class="col-12 completion-bar" />
	{/if}
</div>

<style>
	.challenge-name {
		font-size: 32px;
		font-weight: bold;
	}
	.challenge-description {
		font-size: 20px;
		line-height: 1.2em;
		text-overflow: ellipsis;
	}
	.completion-bar {
		background: #8be59c;
		height: 12px;
		border: 1px solid #707070;
	}
</style>
