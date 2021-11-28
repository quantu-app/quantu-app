<script lang="ts">
	import type { Unit } from '$lib/api/quantu-app-api';
	import { organizationPath } from '$lib/utils';

	export let organizationId: number;
	export let courseId: number = undefined;
	export let unit: Unit;
	export let onDelete: () => void;

	$: updatedAt = new Date(unit.updatedAt || '');
</script>

<div class="list-group-item">
	<div class="d-flex w-100 justify-content-between">
		<h4>
			<a aria-label="Edit" href={organizationPath(organizationId, courseId, unit.id)}>{unit.name}</a
			>
		</h4>
		<div class="d-flex">
			<div class="d-inline mt-2">
				Last updated {updatedAt.toLocaleTimeString()}
				{updatedAt.toLocaleDateString()}
			</div>
			<div class="dropdown">
				<button
					id={`unit-dropdown-${unit.id}`}
					class="btn btn-ghost dropdown-toggle"
					type="button"
					data-bs-toggle="dropdown"
					aria-expanded="false"
				>
					<i class="bi bi-three-dots-vertical" />
				</button>
				<ul class="dropdown-menu dropdown-menu-end" aria-labelledby={`unit-dropdown-${unit.id}`}>
					<li>
						<a
							class="dropdown-item justify-content-between"
							href={organizationPath(organizationId, courseId, unit.id)}>Edit</a
						>
					</li>
					<li>
						<button
							type="button"
							class="dropdown-item justify-content-between"
							data-bs-toggle="modal"
							data-bs-target="#delete-unit"
							aria-label="Delete"
							on:click={onDelete}>Delete</button
						>
					</li>
				</ul>
			</div>
		</div>
	</div>
</div>
