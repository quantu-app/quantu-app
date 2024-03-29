<svelte:options immutable />

<script lang="ts" context="module">
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
	import type { StateCourse } from '$lib/state/courses';
	import { XorShiftRng } from '@aicacia/rand';
	import { formatDistanceToNowStrict, isBefore, isSameDay } from 'date-fns';
	import { departmentCoursePath, apiAssetPath } from '$lib/routingUtils';

	export let course: StateCourse;

	const rng = XorShiftRng.fromSeed(new Date(course.createdAt).getTime());
	const image = rng.fromArray(IMAGES).unwrap();
</script>

<div class="card">
	<img
		src={course.logoId ? apiAssetPath(course.logoId) : image}
		alt={course.name}
		class="card-img-top"
	/>
	<div class="card-body">
		<h5 class="card-title mt-4 mt-lg-0 mb-0">{course.name}</h5>
		<div class="text-end">
			<!-- svelte-ignore a11y-missing-content -->
			<a
				role="button"
				aria-label="enter"
				class="stretched-link"
				href={departmentCoursePath(course.department.url, course.url)}
			/>
		</div>
	</div>
	<div class="card-footer">
		<div class="text-muted card-footer-info">
			<span class="text-uppercase">{course.department.name}</span><br />
			<span class="releasedAt">
				{#if course.releasedAt}
					<span class="dot-block" />{formatDistanceToNowStrict(course.releasedAt, {
						addSuffix: false
					})}
				{/if}
				{#if course.releasedAt && !isSameDay(course.releasedAt, TODAY) && isBefore(course.releasedAt, TODAY)}
					ago
				{/if}
			</span>
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
