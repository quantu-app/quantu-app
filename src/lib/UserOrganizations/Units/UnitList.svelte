<script lang="ts">
	import type { Unit } from '$lib/api/quantu-app-api';
	import { deleteUnit } from '$lib/state/organizationUnits';
	import DeleteUnit from './DeleteUnit.svelte';
	import UnitListItem from './UnitListItem.svelte';

	export let organizationId: number;
	export let courseId: number | undefined;
	export let units: Unit[];
	export let showIndices = false;

	let unitToDelete: Unit;

	function createOnDelete(unit: Unit) {
		return function onDelete() {
			unitToDelete = unit;
		};
	}

	async function onDeleteUnit() {
		if (unitToDelete) {
			await deleteUnit(organizationId, unitToDelete.id);
			unitToDelete = undefined;
		}
	}
</script>

<div class="list-group list-group-flush">
	{#each units as unit, index (unit.id)}
		<UnitListItem
			{organizationId}
			{courseId}
			{unit}
			{index}
			{showIndices}
			onDelete={createOnDelete(unit)}
		/>
	{/each}
</div>

<DeleteUnit unit={unitToDelete} {onDeleteUnit} />
