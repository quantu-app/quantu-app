<script lang="ts">
	import { goto } from '$app/navigation';
	import { addNotification, NotificationType } from '$lib/state/notifications';
	import { createUnit } from '$lib/state/organizationUnits';
	import { organizationPath } from '$lib/utils';

	export let organizationId: number;
	export let courseId: number = undefined;

	let unitCreating = false;
	let newUnitName = '';

	async function onCreateUnit() {
		unitCreating = true;
		try {
			const unit = await createUnit(organizationId, { name: newUnitName, courseId });
			goto(organizationPath(organizationId, courseId, unit.id));
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
	}
</script>

<form on:submit|preventDefault class="mt-2">
	<div class="input-group">
		<input type="text" class="form-control" placeholder="New Unit name" bind:value={newUnitName} />
		<button
			type="submit"
			disabled={unitCreating || !newUnitName.trim()}
			class="btn btn-primary"
			aria-label="Create Unit"
			on:click={onCreateUnit}
		>
			{#if unitCreating}
				<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
			{/if}
			Create
		</button>
	</div>
</form>
