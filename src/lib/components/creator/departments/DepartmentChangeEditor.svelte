<script lang="ts">
	import RichEditor from '$lib/components/editor/RichEditor.svelte';
	import { validDepartmentUrl } from '$lib/state/creator/departments';
	import { addNotification, NotificationType } from '$lib/state/notifications';
	import { isUrlSafe } from '$lib/utils';
	import { debounce } from '@aicacia/debounce';
	import type { Department } from '@prisma/client';
	import SelectAsset from '../assets/SelectAsset.svelte';

	export let departmentChange: Partial<Department>;
	export let disabled = false;

	let departmentUrl = departmentChange.url;
	let validUrl = false;

	$: validUrl = !!departmentChange.url && isUrlSafe(departmentChange.url);

	let validatingUrl = false;
	async function onUrlChange() {
		if (!validUrl || validatingUrl || departmentUrl === departmentChange.url) {
			return;
		}
		validatingUrl = true;
		try {
			validUrl = await validDepartmentUrl(departmentChange.url as string);
		} catch (e) {
			console.error(e);
			addNotification({
				type: NotificationType.Danger,
				title: 'Error validating URL',
				description: (e as Error).message
			});
		} finally {
			validatingUrl = false;
		}
	}
	const debouncedOnUrlChange = debounce(onUrlChange, 300);
</script>

<div class="row">
	<div class="col-md">
		<label for="department-name" class="form-label">Name</label>
		<input
			id="department-name"
			type="text"
			class="form-control"
			placeholder="Department Name"
			{disabled}
			bind:value={departmentChange.name}
		/>
	</div>
	<div class="col-md">
		<label for="department-url" class="form-label">URL</label>
		<input
			id="department-url"
			type="text"
			class="form-control"
			placeholder="Department URL"
			class:is-invalid={!validUrl}
			{disabled}
			bind:value={departmentChange.url}
			on:change={debouncedOnUrlChange}
		/>
	</div>
</div>
<hr />
<div class="row">
	{#if departmentChange.id}
		<div class="col-md-3">
			<div class="form-control">
				<label for="department-logo" class="form-label">Logo</label>
				<SelectAsset
					id="department-logo"
					departmentId={departmentChange.id}
					bind:assetId={departmentChange.logoId}
					type="IMAGE"
				/>
			</div>
		</div>
	{/if}
	<div class="col">
		<label for="department-description" class="form-label">Description</label>
		<RichEditor id="department-description" bind:value={departmentChange.description} />
	</div>
</div>
