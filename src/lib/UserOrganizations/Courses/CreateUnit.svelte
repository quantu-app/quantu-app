<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Course } from '$lib/api/quantu-app-api';
	import { addNotification, NotificationType } from '$lib/state/notifications';
	import { createUnit } from '$lib/state/organizationUnits';

	export let organizationId: number;
	export let course: Course;

	let unitCreating = false;
	let newUnitName: string;

	$: onCreateUnit = async () => {
		unitCreating = true;
		try {
			const unit = await createUnit(organizationId, { name: newUnitName, courseId: course.id });
			goto(`/user/organizations/${organizationId}/courses/${course.id}/units/${unit.id}`);
		} catch (error) {
			unitCreating = false;
			Object.entries(error.body.errors).map(([name, message]: [string, string[]]) => {
				addNotification({
					type: NotificationType.Danger,
					heading: name,
					description: message.join(', ')
				});
			});
		}
	};
</script>

<button
	type="button"
	class="btn btn-primary"
	data-bs-toggle="modal"
	data-bs-target="#create-unit"
	aria-label="Create Unit">Create Unit</button
>

<div
	class="modal fade"
	id="create-unit"
	tabindex="-1"
	aria-labelledby="create-unit-label"
	aria-hidden="true"
>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h5 id="create-unit-label" class="modal-title">Create Unit</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				<div class="form-group">
					<label for="unit-name">Unit Name</label>
					<input
						type="text"
						class="form-control"
						id="unit-name"
						placeholder="Unit Name"
						bind:value={newUnitName}
					/>
				</div>
			</div>
			<div class="modal-footer">
				<button
					type="button"
					on:click={onCreateUnit}
					disabled={!newUnitName || unitCreating}
					data-bs-dismiss="modal"
					class="btn btn-primary text-white"
				>
					{#if unitCreating}
						<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
					{/if}
					Create
				</button>
				<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
			</div>
		</div>
	</div>
</div>
