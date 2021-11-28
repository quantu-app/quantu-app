<script lang="ts">
	import type { Unit } from '$lib/api/quantu-app-api';
	import { deleteUnit } from '$lib/state/organizationUnits';
	import DeleteUnit from './DeleteUnit.svelte';
	import UnitListItem from './UnitListItem.svelte';

	export let organizationId: number;
	export let courseId: number | undefined;
	export let units: Unit[];

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
	{#each units as unit (unit.id)}
		<UnitListItem {organizationId} {courseId} {unit} onDelete={createOnDelete(unit)} />
	{/each}
</div>

<DeleteUnit unit={unitToDelete} {onDeleteUnit} />
