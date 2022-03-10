<script lang="ts" context="module">
	const IMAGES = [
		'https://raw.githubusercontent.com/quantu-app/design-platform/master/app/resources/challenges/no_image_placeholder_imgs/Three%20octogons.png',
		'https://raw.githubusercontent.com/quantu-app/design-platform/master/app/resources/challenges/no_image_placeholder_imgs/Two%20Hexagons.png',
		'https://github.com/quantu-app/design-platform/raw/master/app/resources/challenges/no_image_placeholder_imgs/Two%20Triangles.png',
		'https://github.com/quantu-app/design-platform/raw/master/app/resources/challenges/no_image_placeholder_imgs/Single%20Triangle%20Touching%20Edges.png'
	];
</script>

<script lang="ts">
	import { base } from '$app/paths';
	import type { StateChallenge } from '$lib/state/challenges';
	import { XorShiftRng } from '@aicacia/rand';
	import { titleCase } from 'title-case';
	import { format } from 'date-fns';
	import enUSLocale from 'date-fns/locale/en-US';

	export let challenge: StateChallenge;

	$: date = format(new Date(challenge.releasedAt || challenge.createdAt), 'PPPP', {
		locale: enUSLocale
	});

	const rng = XorShiftRng.fromSeed(new Date(challenge.createdAt).getTime());
	const image = rng.fromArray(IMAGES).unwrap();
</script>

<div class="row justify-content-center my-4">
	<p class="text-center">{date}</p>
	<div class="col-md-12 border p-4">
		<div class="row">
			<div class="col-lg-6">
				<img src={image} alt={challenge.name} />
			</div>
			<div class="col-lg-6">
				<h2 class="challenge-name">{challenge.name}</h2>
				<p class="challenge-description">{challenge.description}</p>
			</div>
		</div>
		<div class="row">
			<div class="col-6">
				<div class="text-muted text-uppercase mt-4">{challenge.department.name}</div>
			</div>

			<div class="col-6 text-end">
				<a
					role="button"
					class="btn btn-primary me-2"
					href={`${base}/d/${challenge.department.url}/challenges/${challenge.url}`}>Solve</a
				>
			</div>
		</div>
	</div>
</div>

<style>
	.challenge-name {
		font-size: 32px;
		font-weight: bold;
	}
	.challenge-description {
		font-size: 20px;
		line-height: 1.2em;
	}
</style>
