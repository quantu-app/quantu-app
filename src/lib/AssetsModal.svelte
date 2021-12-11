<script lang="ts">
	import { onMount } from 'svelte';
	import Assets from './Assets.svelte';
	import { organizationIdAssets } from './state/selectedAssets';

	let organizationId: number;

	onMount(() => {
		const modal = document.getElementById('assets-modal');

		function onOpen() {
			organizationId = $organizationIdAssets;
		}

		modal.addEventListener('show.bs.modal', onOpen);

		return () => {
			modal.removeEventListener('show.bs.modal', onOpen);
		};
	});
</script>

<div
	class="modal fade"
	id="assets-modal"
	tabindex="-1"
	aria-labelledby="assets-modal-label"
	aria-hidden="true"
>
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<h5 id="assets-modal-label" class="modal-title">Assets</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				{#if organizationId}
					<Assets {organizationId} />
				{/if}
			</div>
			<div class="modal-footer">
				<button id="assets-modal-add" type="button" class="btn btn-primary" data-bs-dismiss="modal"
					>Add</button
				>
				<button type="button" class="btn btn-danger text-white" data-bs-dismiss="modal"
					>Close</button
				>
			</div>
		</div>
	</div>
</div>
