<svelte:options immutable />

<script lang="ts">
	import Portal from 'svelte-portal';
	import { clickoutside } from './clickoutside';

	export let target: HTMLElement;
	export let open = false;

	let x = -1000000;
	let y = -1000000;

	function onContextMenu(e: MouseEvent) {
		e.preventDefault();
		x = e.clientX;
		y = e.clientY;
		open = true;
		return false;
	}
	function onClose() {
		open = false;
	}

	let prevTarget: HTMLElement;
	$: if (target !== prevTarget) {
		if (prevTarget) {
			prevTarget.removeEventListener('contextmenu', onContextMenu);
		}
		target.addEventListener('contextmenu', onContextMenu);
		prevTarget = target;
	}
</script>

<Portal
	><div
		class="position-absolute dropdown-menu"
		class:show={open}
		style="top:{y}px;left:{x}px;"
		use:clickoutside
		on:clickoutside={onClose}
	>
		<slot />
	</div></Portal
>
