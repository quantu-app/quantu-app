<script lang="ts" context="module">
	const IMAGES = [
		'https://raw.githubusercontent.com/quantu-app/design-platform/master/app/resources/challenges/no_image_placeholder_imgs/Three%20octogons.png',
		'https://raw.githubusercontent.com/quantu-app/design-platform/master/app/resources/challenges/no_image_placeholder_imgs/Two%20Hexagons.png'
	];
</script>

<script lang="ts">
	import type { Question } from '$lib/api/quantu-app-api';
	import RichViewer from '$lib/RichViewer.svelte';
	import { XorShiftRng } from '@aicacia/rand';
	import { titleCase } from 'title-case';

	export let question: Question;

	const rng = XorShiftRng.fromSeed(question.id);
	const image = rng.fromArray(IMAGES).unwrap();
</script>

<div class="list-group-item">
	<div class="row justify-content-center">
		<div class="col-md-6 border p-4">
			<div class="row">
				<div class="col-lg-6">
					<img src={image} alt={question.name || 'No Name'} />
				</div>
				<div class="col-lg-6">
					<h2>{question.name || 'No Name'}</h2>
					<p class="d-inline">{titleCase(question.type.replace('_', ' '))}</p>
				</div>
			</div>
			<div class="text-end">
				<a role="button" class="btn btn-primary me-2" href={`/challenges/${question.id}`}>Solve</a>
				<a
					role="button"
					class="btn btn-secondary text-white me-2"
					href={`/challenges/${question.id}/review`}>Review</a
				>
			</div>
		</div>
	</div>
</div>
