<script lang="ts">
	import type { Course, Unit } from '$lib/api/quantu-app-api';
	import { updateCourse } from '$lib/state/organizationCourses';
	import { organizationUnits } from '$lib/state/organizationUnits';
	import { organizationPath } from '$lib/utils';
	import UnitTree from './UnitTree.svelte';

	export let organizationId: number;
	export let course: Course;
	export let units: Unit[];

	let updatingPublished = false;
	function onPublishedChange() {
		updatingPublished = true;
		course.published = !course.published;
		updateCourse(organizationId, course.id, {
			published: course.published
		}).finally(() => {
			updatingPublished = false;
		});
	}
</script>

<div class="ms-2">
	<div class="d-flex flex-row justify-content-between">
		<h4 class="d-flex">
			<a href={organizationPath(organizationId, course.id)}>{course.name}</a>
		</h4>
		<button
			type="button"
			class="d-flex btn"
			class:btn-primary={course.published}
			class:btn-outline-primary={!course.published}
			disabled={updatingPublished}
			on:click={onPublishedChange}
		>
			{#if course.published}
				<i class="bi bi-eye" />
			{:else}
				<i class="bi bi-eye-slash" />
			{/if}
		</button>
	</div>
	<ul class="list-group list-group-flush">
		<li class="list-group-item pe-0">
			{#each units as unit, index (unit.id)}
				<UnitTree
					{organizationId}
					courseId={course.id}
					{unit}
					{index}
					children={Object.values($organizationUnits.childrenById[unit.id] || {})}
				/>
			{/each}
		</li>
	</ul>
</div>
