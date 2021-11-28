<script lang="ts">
	import type { Course, Unit } from '$lib/api/quantu-app-api';
	import { organizationUnits } from '$lib/state/organizationUnits';
	import { organizationPath } from '$lib/utils';
	import UnitTree from './UnitTree.svelte';

	export let organizationId: number;
	export let course: Course;
	export let units: Unit[];
</script>

<div class="ms-4">
	<h4>
		<a href={organizationPath(organizationId, course.id)}>{course.name}</a>
	</h4>
	<ul class="list-group list-group-flush">
		{#each units as unit, index (unit.id)}
			<UnitTree
				{organizationId}
				courseId={course.id}
				{unit}
				{index}
				children={Object.values($organizationUnits.childrenById[unit.id] || {})}
			/>
		{/each}
	</ul>
</div>
