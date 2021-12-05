<script lang="ts">
	import type { Unit, UnitChildList } from '$lib/api/quantu-app-api';
	import { getUnitChildren, updateUnit } from '$lib/state/organizationUnits';
	import { organizationPath } from '$lib/utils';
	import UnitTreeChild from './UnitTreeChild.svelte';
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

	let updatingPublished = false;
	function onPublishedChange() {
		updatingPublished = true;
		unit.published = !unit.published;
		updateUnit(organizationId, unit.id, {
			published: unit.published
		}).finally(() => {
			updatingPublished = false;
		});
	}
</script>

<div class="ms-2">
	<div class="d-flex flex-row justify-content-between">
		<h5 class="d-flex">
			<a href={organizationPath(organizationId, courseId, unit.id)}
				>{index !== undefined ? `${index + 1} - ` : ''}{unit.name}</a
			>
		</h5>
		<button
			type="button"
			class="d-flex btn"
			class:btn-primary={unit.published}
			class:btn-outline-primary={!unit.published}
			disabled={updatingPublished}
			on:click={onPublishedChange}
		>
			{#if unit.published}
				<i class="bi bi-eye" />
			{:else}
				<i class="bi bi-eye-slash" />
			{/if}
		</button>
	</div>
	<ul class="list-group list-group-flush">
		<li class="list-group-item pe-0">
			{#if children.length === 0}
				<button class="btn btn-secondary" disabled={loading} on:click={onLoad}>
					{#if loading}
						<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
					{:else}
						<span>...</span>
					{/if}
				</button>
			{:else}
				{#each children as child, index (child.id + child.type)}
					<UnitTreeChild {organizationId} {courseId} unitId={unit.id} {child} {index} />
				{/each}
			{/if}
		</li>
	</ul>
</div>
