<script lang="ts">
	import type { Unit, UnitChildList } from '$lib/api/quantu-app-api';
	import { getUnitChildren } from '$lib/state/organizationUnits';
	import { organizationPath } from '$lib/utils';

	export let organizationId: number;
	export let courseId: number = undefined;
	export let index: number = undefined;
	export let unit: Unit;
	export let children: UnitChildList;

	let loading = false;
	async function onLoad() {
		loading = true;
		try {
			getUnitChildren(organizationId, unit.id);
		} finally {
			loading = false;
		}
	}
</script>

<div class="ms-4">
	<h5>
		<a href={organizationPath(organizationId, courseId, unit.id)}
			>{index !== undefined ? `${index + 1} - ` : ''}{unit.name}</a
		>
	</h5>
	<ul class="list-group list-group-flush">
		{#if children.length === 0}
			<button class="btn btn-secondary" disabled={loading} on:click={onLoad}>
				{#if loading}
					<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
				{:else}
					<span>...</span>
				{/if}
			</button>
		{/if}
		{#each children as child, index (child.id + child.type)}
			<li class="list-group-item">
				<a href={organizationPath(organizationId, courseId, unit.id, child.id, child.type)}
					>{index + 1} - {child.name}</a
				>
			</li>
		{/each}
	</ul>
</div>
