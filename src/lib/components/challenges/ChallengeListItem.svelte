<script lang="ts" context="module">
	const IMAGES = [
		'https://raw.githubusercontent.com/quantu-app/design-platform/master/app/resources/challenges/no_image_placeholder_imgs/Three%20octogons.png',
		'https://raw.githubusercontent.com/quantu-app/design-platform/master/app/resources/challenges/no_image_placeholder_imgs/Two%20Hexagons.png',
		'https://github.com/quantu-app/design-platform/raw/master/app/resources/challenges/no_image_placeholder_imgs/Two%20Triangles.png',
		'https://github.com/quantu-app/design-platform/raw/master/app/resources/challenges/no_image_placeholder_imgs/Single%20Triangle%20Touching%20Edges.png'
	];
</script>

<script lang="ts">
	import { XorShiftRng } from '@aicacia/rand';
	import type { Challenge, Topic } from '@prisma/client';
	import { titleCase } from 'title-case';
	export let challenge: Challenge & { topic: Topic };
	$: date = new Date(challenge.createdAt).toLocaleString('default', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
	const rng = XorShiftRng.fromSeed(new Date(challenge.createdAt).getTime());
	const image = rng.fromArray(IMAGES).unwrap();
</script>

<div class="row justify-content-center m-4">
	<h3 class="text-center">{date}</h3>
	<div class="col-md-8 border p-4">
		<div class="row">
			<div class="col-lg-6">
				<img src={image} alt={challenge.name || 'No Name'} />
			</div>
			<div class="col-lg-6">
				<h2>{challenge.name || 'No Name'}</h2>
				<p class="d-inline">{titleCase(challenge.type.replace('_', ' '))}</p>
			</div>
		</div>
		<div class="text-end">
			<a role="button" class="btn btn-primary me-2" href={`/challenges/${challenge.id}`}>Solve</a>
			<a
				role="button"
				class="btn btn-secondary text-white me-2"
				href={`/challenges/${challenge.id}/review`}>Review</a
			>
		</div>
		<div class="text-muted">{challenge.topic.name}</div>
	</div>
</div>
