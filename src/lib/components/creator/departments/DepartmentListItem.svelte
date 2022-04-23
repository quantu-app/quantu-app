<svelte:options immutable />

<script lang="ts">
	import { base } from '$app/paths';
	import type { Department } from '@prisma/client';

	export let department: Department;
	export let onUpdate: () => void;
	export let onDelete: () => void;
</script>

<div class="list-group-item">
	<div class="d-flex w-100 justify-content-between">
		<h4>
			<a
				href={`${base}/creator/departments/${department.id}`}
				type="button"
				class="btn btn-link"
				on:click={onUpdate}>{department.name} - {department.url}</a
			>
		</h4>
		<div class="d-flex">
			<div class="dropdown">
				<button
					id={`department-dropdown-${department.id}`}
					class="btn btn-ghost dropdown-toggle"
					type="button"
					data-bs-toggle="dropdown"
					aria-expanded="false"
				>
					<i class="bi bi-three-dots-vertical" />
				</button>
				<ul
					class="dropdown-menu dropdown-menu-end"
					aria-labelledby={`department-dropdown-${department.id}`}
				>
					<slot name="dropdown" {department} {onUpdate} {onDelete}>
						<li>
							<button
								type="button"
								class="dropdown-item justify-content-between"
								data-bs-toggle="modal"
								data-bs-target="#update-department"
								aria-label="Update"
								on:click={onUpdate}>Update</button
							>
						</li>
						<li>
							<button
								type="button"
								class="dropdown-item justify-content-between"
								data-bs-toggle="modal"
								data-bs-target="#delete-department"
								aria-label="Delete"
								on:click={onDelete}>Delete</button
							>
						</li>
					</slot>
				</ul>
			</div>
		</div>
	</div>
</div>
