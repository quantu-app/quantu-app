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

	import { XorShiftRng } from '@aicacia/rand';
	import type { Challenge, Topic } from '@prisma/client';
	import { onMount } from 'svelte';
	import { titleCase } from 'title-case';

	export let challenge: Challenge & { topic: Topic };

	let topics: Topic[] = [];

	$: path = [...topics.map((t) => t.url), challenge.url].join('/');
	$: date = new Date(challenge.createdAt).toLocaleString('default', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
	const rng = XorShiftRng.fromSeed(new Date(challenge.createdAt).getTime());
	const image = rng.fromArray(IMAGES).unwrap();

	onMount(async () => {
		topics = await fetch(`${base}/api/topics/${challenge.topicId}/path`).then((res) => res.json());
	});
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
			<a role="button" class="btn btn-primary me-2" href={`/challenges/${path}`}>Solve</a>
			<a role="button" class="btn btn-secondary text-white me-2" href={`/challenges/${path}/review`}
				>Review</a
			>
		</div>
		<div class="text-muted">{challenge.topic.name}</div>
	</div>
</div>