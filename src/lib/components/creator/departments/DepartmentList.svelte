<script lang="ts">
	import DeleteDepartment from './DeleteDepartment.svelte';
	import DepartmentListItem from './DepartmentListItem.svelte';
	import UpdateDepartment from './UpdateDepartment.svelte';
	import type { Department } from '@prisma/client';
	import { deleteDepartment, updateDepartment } from '$lib/state/creator/departments';

	export let departments: Department[];

	let department: Department;
	let departmentIndex: number;

	function createOnUpdate(t: Department, index: number) {
		return function onUpdate() {
			department = t;
			departmentIndex = index;
		};
	}
	function createOnDelete(t: Department, index: number) {
		return function onDelete() {
			department = t;
			departmentIndex = index;
		};
	}

	async function onUpdateDepartment() {
		if (department) {
			const { id, ...updateBody } = department;
			await updateDepartment(id, updateBody);
			department = undefined;
			departmentIndex = undefined;
		}
	}
	async function onDeleteDepartment() {
		if (department) {
			await deleteDepartment(department.id);
			department = undefined;
			departmentIndex = undefined;
		}
	}
</script>

<div class="list-group list-group-flush">
	{#each departments as department, index (department.id)}
		<DepartmentListItem
			{department}
			onUpdate={createOnUpdate(department, index)}
			onDelete={createOnDelete(department, index)}
		>
			<slot
				slot="dropdown"
				name="dropdown"
				{department}
				onUpdate={createOnUpdate(department, index)}
				onDelete={createOnDelete(department, index)}
			>
				<li>
					<button
						type="button"
						class="dropdown-item justify-content-between"
						data-bs-toggle="modal"
						data-bs-target="#update-department"
						aria-label="Update"
						on:click={createOnUpdate(department, index)}>Update</button
					>
				</li>
				<li>
					<button
						type="button"
						class="dropdown-item justify-content-between"
						data-bs-toggle="modal"
						data-bs-target="#delete-department"
						aria-label="Delete"
						on:click={createOnDelete(department, index)}>Delete</button
					>
				</li>
			</slot>
		</DepartmentListItem>
	{/each}
</div>

<UpdateDepartment {department} {onUpdateDepartment} />
<DeleteDepartment {department} {onDeleteDepartment} />
