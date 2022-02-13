<script lang="ts">
	import { goto } from '$app/navigation';
	import { addNotification, NotificationType } from '$lib/state/notifications';
	import { createOrganization } from '$lib/state/userOrganizations';
	import { organizationPath } from '$lib/utils';

	let creating = false;
	let newName: string;

	$: onCreate = async () => {
		creating = true;
		try {
			const organization = await createOrganization({ name: newName });
			goto(organizationPath(organization.id));
		} catch (error) {
			creating = false;
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
	data-bs-target="#create-organization"
	aria-label="Create">Create Organization</button
>

<div
	class="modal fade"
	id="create-organization"
	tabindex="-1"
	aria-labelledby="create-organization-label"
	aria-hidden="true"
>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h5 id="create-organization-label" class="modal-title">Create Organization</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				<div class="form-group">
					<label for="organization-name">Name</label>
					<input
						type="text"
						class="form-control"
						id="organization-name"
						placeholder="Name"
						bind:value={newName}
					/>
				</div>
			</div>
			<div class="modal-footer">
				<button
					type="button"
					on:click={onCreate}
					disabled={!newName || creating}
					data-bs-dismiss="modal"
					class="btn btn-primary text-white"
				>
					{#if creating}
						<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
					{/if}
					Create
				</button>
				<button type="button" class="btn btn-danger text-white" data-bs-dismiss="modal"
					>Close</button
				>
			</div>
		</div>
	</div>
</div>
