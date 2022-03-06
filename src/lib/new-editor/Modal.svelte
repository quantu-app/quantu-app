<svelte:options immutable={true} />

<script lang="ts">
	import { onMount } from 'svelte';
	import Portal from 'svelte-portal/src/Portal.svelte';

	export let open = false;
	export let onClose: () => void = () => undefined;

	let prevOpen: boolean;
	$: if (modal && prevOpen !== open) {
		prevOpen = open;

		if (open) {
			modal.show();
		} else {
			modal.hide();
		}
	}

	let modalElement: HTMLDivElement;
	$: modal = modalElement && window.bootstrap.Modal.getOrCreateInstance(modalElement);

	function onOpen() {
		prevOpen = true;
		open = true;
	}
	function onCloseInternal() {
		prevOpen = false;
		open = false;
		onClose();
	}

	onMount(() => {
		modalElement.addEventListener('show.bs.modal', onOpen, false);
		modalElement.addEventListener('hide.bs.modal', onCloseInternal, false);

		return () => {
			modalElement.removeEventListener('show.bs.modal', onOpen, false);
			modalElement.removeEventListener('hide.bs.modal', onCloseInternal, false);
		};
	});
</script>

<Portal>
	<div bind:this={modalElement} class="modal" tabindex="-1">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
				</div>
				<div class="modal-body">
					<slot />
				</div>
			</div>
		</div>
	</div>
</Portal>
