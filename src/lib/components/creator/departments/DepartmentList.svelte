<script lang="ts">
	import DeleteDepartment from './DeleteDepartment.svelte';
	import DepartmentListItem from './DepartmentListItem.svelte';
	import UpdateDepartment from './UpdateDepartment.svelte';
	import type { Department } from '@prisma/client';
	import { deleteDepartment, updateDepartment } from '$lib/state/creator/departments';

	export let departments: Department[];

	let departmentToUpdate: Department;
	let departmentToDelete: Department;

	function createOnUpdate(t: Department) {
		return function onUpdate() {
			departmentToUpdate = t;
		};
	}
	function createOnDelete(t: Department) {
		return function onDelete() {
			departmentToDelete = t;
		};
	}

	async function onUpdateDepartment() {
		if (departmentToUpdate) {
			const { id, ...updateBody } = departmentToUpdate;
			await updateDepartment(id, updateBody);
			departmentToUpdate = undefined;
		}
	}
	async function onDeleteDepartment() {
		if (departmentToDelete) {
			await deleteDepartment(departmentToDelete.id);
			departmentToDelete = undefined;
		}
	}
</script>

<div class="list-group list-group-flush">
	{#each departments as department (department.id)}
		<DepartmentListItem
			{department}
			onUpdate={createOnUpdate(department)}
			onDelete={createOnDelete(department)}
		>
			<slot
				slot="dropdown"
				name="dropdown"
				{department}
				onUpdate={createOnUpdate(department)}
				onDelete={createOnDelete(department)}
			>
				<li>
					<button
						type="button"
						class="dropdown-item justify-content-between"
						data-bs-toggle="modal"
						data-bs-target="#update-department"
						aria-label="Update"
						on:click={createOnUpdate(department)}>Update</button
					>
				</li>
				<li>
					<button
						type="button"
						class="dropdown-item justify-content-between"
						data-bs-toggle="modal"
						data-bs-target="#delete-department"
						aria-label="Delete"
						on:click={createOnDelete(department)}>Delete</button
					>
				</li>
			</slot>
		</DepartmentListItem>
	{/each}
</div>

<UpdateDepartment department={departmentToUpdate} {onUpdateDepartment} />
<DeleteDepartment department={departmentToDelete} {onDeleteDepartment} />
