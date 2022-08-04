<svelte:options immutable />

<script lang="ts">
	import { onMount } from 'svelte';
	import Portal from 'svelte-portal/src/Portal.svelte';

	export let open = false;
	export let size: 'sm' | 'md' | 'lg' = 'lg';
	export let onClose: () => void = () => undefined;

	let key = Math.random();
	let prevOpen: boolean;
	$: if (modal && prevOpen !== open) {
		prevOpen = open;
		key = Math.random();

		if (open) {
			modal.show();
		} else {
			modal.hide();
		}
	}

	function onOpen() {
		prevOpen = true;
		open = true;
	}
	function onCloseInternal() {
		prevOpen = false;
		open = false;
		onClose();
	}

	let modalElement: HTMLDivElement;
	let modal: bootstrap.Modal;

	onMount(() => {
		modal = window.bootstrap.Modal.getOrCreateInstance(modalElement);

		modalElement.addEventListener('show.bs.modal', onOpen, false);
		modalElement.addEventListener('hide.bs.modal', onCloseInternal, false);

		return () => {
			modalElement.removeEventListener('show.bs.modal', onOpen, false);
			modalElement.removeEventListener('hide.bs.modal', onCloseInternal, false);
		};
	});
</script>

<Portal>
	<div
		class="modal fade"
		role="dialog"
		tabindex="-1"
		data-bs-focus="false"
		aria-hidden="true"
		bind:this={modalElement}
	>
		<div class="modal-dialog modal-{size}">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">
						{#key key}<slot name="header" />{/key}
					</h5>
					<button type="button" class="btn-close" aria-label="Close" data-bs-dismiss="modal" />
				</div>
				<div class="modal-body">
					{#key key}<slot />{/key}
				</div>
				<div class="modal-footer">
					{#key key}<slot name="footer" />{/key}
					<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
				</div>
			</div>
		</div>
	</div>
</Portal>
