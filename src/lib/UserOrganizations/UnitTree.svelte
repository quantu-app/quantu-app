<script lang="ts">
	import type { Unit, UnitChildList } from '$lib/api/quantu-app-api';
	import { organizationPath } from '$lib/utils';

	export let organizationId: number;
	export let courseId: number = undefined;
	export let index: number = undefined;
	export let unit: Unit;
	export let children: UnitChildList;
</script>

<div class="ms-4">
	<h5>
		<a href={organizationPath(organizationId, courseId, unit.id)}
			>{index !== undefined ? `${index + 1} - ` : ''}{unit.name}</a
		>
	</h5>
	<ul class="list-group list-group-flush">
		{#each children as child, index (child.id + child.type)}
			<li class="list-group-item">
				<a href={organizationPath(organizationId, courseId, unit.id, child.id, child.type)}
					>{index + 1} - {child.type} {child.name}</a
				>
			</li>
		{/each}
	</ul>
</div>
